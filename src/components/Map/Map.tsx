"use client";

import React, {useCallback, useEffect, useState} from "react";
import {CircleMarker, MapContainer, TileLayer, useMap} from "react-leaflet";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import {Place} from "@/types/Place";
import {MarkerWithPopup} from "@/components/Map/MarkerWithPopup";
import {useToast} from "@/contexts/ToastContext";
import {useTranslation} from "@/i18n";
import {useGeolocation} from "@/hooks/useGeolocation";
import {getVisitedPlaces, saveVisitedPlaces} from "@/lib/storage";
import "leaflet/dist/leaflet.css";

type MapProps = {
  debug?: boolean;
  places: Place[];
  coordinates: {lat: number; lng: number};
  huntSlug: string;
}

type SearchResult = {
  x: number;
  y: number;
  label: string;
  bounds: [[number, number], [number, number]] | null;
  raw: any;
}

// Component to handle map center changes
function MapController({center}: {center: {lat: number; lng: number}}) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

// Component to fix map rendering issues (grey tiles)
function MapInvalidator() {
  const map = useMap();

  useEffect(() => {
    // Invalidate size when component mounts and when window resizes
    const invalidateSize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    invalidateSize();
    window.addEventListener('resize', invalidateSize);

    return () => {
      window.removeEventListener('resize', invalidateSize);
    };
  }, [map]);

  return null;
}

// Button to center map on user's position
function CenterOnMeButton({position}: {position: {lat: number; lng: number}}) {
  const map = useMap();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => map.setView([position.lat, position.lng], 17)}
      title={t('centerOnMe')}
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '10px',
        zIndex: 1000,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid rgba(0,0,0,0.2)',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }}
    >
      📍
    </button>
  );
}

export const Map: React.FC<MapProps> = ({places, coordinates, debug, huntSlug}) => {
  const {addToast} = useToast();
  const { t } = useTranslation();
  const {position: userPosition} = useGeolocation();

  // Store all visited places to trace a route in the map
  // Preset first place
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([places[0]]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  // Track if selection is from search (to auto-open popup) or from initialization (to only bounce)
  const [isSearchSelection, setIsSearchSelection] = useState<boolean>(false);

  useEffect(() => {
    const alreadyVisitedPlaces = getVisitedPlaces<Place>(huntSlug, [places[0]]);
    setVisitedPlaces(alreadyVisitedPlaces);
    // Don't auto-select on initialization to avoid opening popup
    // The bounce effect will be applied to the latest place instead
  }, [huntSlug, places]);
  const onPlaceSelect = (result: SearchResult | null) => {
    if (!result) return;

    if (debug) {
      console.log(`🔍 Searching for place at coordinates: lat=${result.y}, lng=${result.x} (label: "${result.label}")`);
    }
    // Look for place in configuration based on its coordinates
    // Find the closest place and accept it if within a global max distance (~500m)
    const MAX_SEARCH_DISTANCE = 0.005;

    let closestPlace: Place | null = null;
    let minDistance = Infinity;

    places.forEach((location) => {
      const distLat = Math.abs(location.coordinates.lat - result.y);
      const distLng = Math.abs(location.coordinates.lng - result.x);
      const distance = Math.sqrt(distLat * distLat + distLng * distLng);

      if (debug) {
        console.log(`Place: ${location.name} - Distance: ${distance.toFixed(6)}`);
      }

      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = location;
      }
    });

    if (closestPlace !== null && minDistance <= MAX_SEARCH_DISTANCE) {
      // Store in a const to preserve type narrowing in callbacks
      const placeToAdd: Place = closestPlace;
      setVisitedPlaces((prevVisitedPlaces) => {
        const visitedPlaces = [...prevVisitedPlaces, placeToAdd];
        saveVisitedPlaces(huntSlug, visitedPlaces);

        return visitedPlaces;
      });
      // Auto-select this new visited place (from search)
      setIsSearchSelection(true);
      setSelectedPlace(placeToAdd);
      if (debug) {
        console.log("✅ Selected closest place:", placeToAdd.name, "with distance:", minDistance.toFixed(6));
      }
      setMapCenter(placeToAdd.coordinates);
    } else {
      addToast(t('placeNotInGame'), "danger");
      if (debug) {
        console.log("❌ No place found within margin. Search coordinates:", {lat: result.y, lng: result.x});
      }
    }
  };

  // Helps to center map on new marker added
  const [mapCenter, setMapCenter] = useState<{lat: number; lng: number}>(visitedPlaces[0].coordinates);

  // Stable callbacks so MarkerWithPopup (memoized) doesn't re-render on every parent render
  // — react-leaflet rebuilds the popup DOM on every Popup re-render, which would reset the user's scroll.
  const handleMarkerClick = useCallback((place: Place) => {
    setSelectedPlace(place);
    setIsSearchSelection(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setSelectedPlace(null);
    setIsSearchSelection(false);
  }, []);

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={16}
      style={{height: '100%', width: '100%'}}
      zoomControl={true}
      data-testid="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={mapCenter} />
      <MapInvalidator />
      {userPosition && (
        <>
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={8}
            pathOptions={{color: '#fff', weight: 2, fillColor: '#4285F4', fillOpacity: 1}}
          />
          <CenterOnMeButton position={userPosition} />
        </>
      )}
      <AutocompleteControl
          coordinates={coordinates}
          places={places}
          onPlaceSelect={onPlaceSelect}
          onChange={() => {
            setSelectedPlace(null);
            setIsSearchSelection(false);
          }}
          onClear={() => {
            setSelectedPlace(null);
            setIsSearchSelection(false);
          }}
        />
        {visitedPlaces.map((visitedPlace, i) => {
          return (
            <MarkerWithPopup
              key={`marker-${i}`}
              place={visitedPlace}
              isSelected={selectedPlace === visitedPlace}
              isLatest={i === visitedPlaces.length - 1}
              isFirst={i === 0}
              shouldOpenPopup={selectedPlace === visitedPlace && isSearchSelection}
              onMarkerClick={handleMarkerClick}
              onCloseClick={handleCloseClick}
              data-testid={selectedPlace === visitedPlace ? "selected-marker" : `marker-${i}`}
            />
          )
        })}
      </MapContainer>
  );
}
