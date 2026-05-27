"use client";

import React, {useCallback, useEffect, useState} from "react";
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import {Place} from "@/types/Place";
import {MarkerWithPopup} from "@/components/Map/MarkerWithPopup";
import {PlaceSheet} from "@/components/Map/PlaceSheet";
import {useToast} from "@/contexts/ToastContext";
import {useTranslation} from "@/i18n";
import {useGeolocation} from "@/hooks/useGeolocation";
import {getVisitedPlaces, saveVisitedPlaces} from "@/lib/storage";
import {CompassLoader, Icon} from "@/components/UI";
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

// User position marker — forest dot with pulsing halo
const userIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="position:absolute;inset:-10px;border-radius:50%;background:rgba(31,75,63,0.16);animation:cx-pulse 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#1F4B3F;border:3px solid #fff;box-shadow:0 3px 8px rgba(31,75,63,0.5);"></div>
    </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Component to handle map center changes
function MapController({center}: {center: {lat: number; lng: number}}) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

// Dismiss the place sheet when tapping the map background
function MapClickHandler({onMapClick}: {onMapClick: () => void}) {
  useMapEvents({click: () => onMapClick()});
  return null;
}

// Component to fix map rendering issues (grey tiles)
function MapInvalidator() {
  const map = useMap();

  useEffect(() => {
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
      aria-label={t('centerOnMe')}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 600,
        width: '42px',
        height: '42px',
        borderRadius: '14px',
        border: '1px solid var(--color-hairline)',
        background: 'var(--color-surface)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <Icon.Target size={18} color="var(--color-forest)" strokeWidth={2} />
    </button>
  );
}

export const Map: React.FC<MapProps> = ({places, coordinates, debug, huntSlug}) => {
  const {addToast} = useToast();
  const { t } = useTranslation();
  const {position: userPosition, error: geoError, isSupported: geoSupported} = useGeolocation();

  // Show the loading screen while geolocation is being acquired, with a
  // safety fallback so a slow/blocked GPS never hangs the map forever.
  const [geoFallback, setGeoFallback] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setGeoFallback(true), 4000);
    return () => clearTimeout(id);
  }, []);

  // Store all visited places to trace a route in the map. Preset first place.
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([places[0]]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    const alreadyVisitedPlaces = getVisitedPlaces<Place>(huntSlug, [places[0]]);
    setVisitedPlaces(alreadyVisitedPlaces);
  }, [huntSlug, places]);

  // Allow the onboarding tour to open/close the first place sheet,
  // and close the sheet when leaving the map tab.
  useEffect(() => {
    const open = () => setSelectedPlace(places[0]);
    const close = () => setSelectedPlace(null);
    window.addEventListener('onboarding:open-first-marker', open);
    window.addEventListener('onboarding:close-first-marker', close);
    window.addEventListener('hunt:close-sheet', close);
    return () => {
      window.removeEventListener('onboarding:open-first-marker', open);
      window.removeEventListener('onboarding:close-first-marker', close);
      window.removeEventListener('hunt:close-sheet', close);
    };
  }, [places]);

  const onPlaceSelect = (result: SearchResult | null) => {
    if (!result) return;

    if (debug) {
      console.log(`🔍 Searching for place at coordinates: lat=${result.y}, lng=${result.x} (label: "${result.label}")`);
    }
    const MAX_SEARCH_DISTANCE = 0.005;

    let closestPlace: Place | null = null;
    let minDistance = Infinity;

    places.forEach((location) => {
      const distLat = Math.abs(location.coordinates.lat - result.y);
      const distLng = Math.abs(location.coordinates.lng - result.x);
      const distance = Math.sqrt(distLat * distLat + distLng * distLng);

      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = location;
      }
    });

    if (closestPlace !== null && minDistance <= MAX_SEARCH_DISTANCE) {
      const placeToAdd: Place = closestPlace;
      setVisitedPlaces((prevVisitedPlaces) => {
        if (prevVisitedPlaces.includes(placeToAdd)) return prevVisitedPlaces;
        const updated = [...prevVisitedPlaces, placeToAdd];
        saveVisitedPlaces(huntSlug, updated);
        return updated;
      });
      setSelectedPlace(placeToAdd);
      setMapCenter(placeToAdd.coordinates);
    } else {
      addToast(t('placeNotInGame'), "danger");
    }
  };

  // Helps to center map on new marker added
  const [mapCenter, setMapCenter] = useState<{lat: number; lng: number}>(visitedPlaces[0].coordinates);

  const handleMarkerClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  // Match by name (unique per hunt): visited places restored from localStorage
  // are deserialized objects, so reference-based indexOf would fail after reload.
  const placeNumber = (place: Place) => places.findIndex((p) => p.name === place.name) + 1;
  const stepNumber = selectedPlace ? placeNumber(selectedPlace) : 0;

  // Loading screen while the position is being acquired
  const acquiringLocation = geoSupported && !userPosition && !geoError && !geoFallback;
  if (acquiringLocation) {
    return (
      <div style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)'}}>
        <CompassLoader text={t('locating')} />
      </div>
    );
  }

  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
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
        <MapClickHandler onMapClick={handleCloseSheet} />
        {userPosition && (
          <>
            <Marker
              position={[userPosition.lat, userPosition.lng]}
              icon={userIcon}
              interactive={false}
            />
            <CenterOnMeButton position={userPosition} />
          </>
        )}
        <AutocompleteControl
          coordinates={coordinates}
          places={places}
          onPlaceSelect={onPlaceSelect}
          onChange={() => setSelectedPlace(null)}
          onClear={() => setSelectedPlace(null)}
        />
        {visitedPlaces.map((visitedPlace, i) => (
          <MarkerWithPopup
            key={`marker-${i}`}
            place={visitedPlace}
            number={placeNumber(visitedPlace)}
            isLatest={i === visitedPlaces.length - 1}
            onMarkerClick={handleMarkerClick}
          />
        ))}
      </MapContainer>

      {selectedPlace && (
        <PlaceSheet key={selectedPlace.name} place={selectedPlace} stepNumber={stepNumber} onClose={handleCloseSheet} />
      )}
    </div>
  );
}
