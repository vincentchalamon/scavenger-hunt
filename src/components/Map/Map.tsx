"use client";

import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, useMap} from "react-leaflet";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import {Place} from "@/types/Place";
import {MarkerWithPopup} from "@/components/Map/MarkerWithPopup";
import {useToast} from "@/contexts/ToastContext";
import {useTranslation} from "@/i18n";
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

export const Map: React.FC<MapProps> = ({places, coordinates, debug, huntSlug}) => {
  const {addToast} = useToast();
  const { t } = useTranslation();

  // Store all visited places to trace a route in the map
  // Preset first place
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([places[0]]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    const alreadyVisitedPlaces = getVisitedPlaces<Place>(huntSlug, [places[0]]);
    setVisitedPlaces(alreadyVisitedPlaces);
    // On Map load, auto-select the latest visited place
    setSelectedPlace(alreadyVisitedPlaces[alreadyVisitedPlaces.length - 1]);
  }, [huntSlug, places]);
  const onPlaceSelect = (result: SearchResult | null) => {
    if (!result) return;

    if (debug) {
      console.log(`🔍 Searching for place at coordinates: lat=${result.y}, lng=${result.x} (label: "${result.label}")`);
    }
    // Look for place in configuration based on it's coordinates
    // Note: it's possible to search for all places through the geocoding service, but only select a place from the configuration
    // Use proximity check with margin of error (approximately 50-100m depending on latitude)
    // Default margin: ~111m at the equator, less at higher latitudes
    const DEFAULT_COORDINATE_MARGIN = 0.001;

    // Find the closest place within its margin
    let closestPlace: Place | null = null;
    let minDistance = Infinity;

    places.forEach((location) => {
      const margin = location.coordinateMargin ?? DEFAULT_COORDINATE_MARGIN;
      const distLat = Math.abs(location.coordinates.lat - result.y);
      const distLng = Math.abs(location.coordinates.lng - result.x);

      // Check if within margin
      if (distLat <= margin && distLng <= margin) {
        // Calculate Euclidean distance for comparison
        const distance = Math.sqrt(distLat * distLat + distLng * distLng);

        if (debug) {
          console.log(`Place: ${location.name}`);
          console.log(`  Coordinates: lat=${location.coordinates.lat}, lng=${location.coordinates.lng}`);
          console.log(`  Result: lat=${result.y}, lng=${result.x}`);
          console.log(`  Margin: ${margin} (${margin === DEFAULT_COORDINATE_MARGIN ? 'default' : 'custom'})`);
          console.log(`  Distance: lat=${distLat.toFixed(6)}, lng=${distLng.toFixed(6)}, total=${distance.toFixed(6)}`);
          console.log(`  Within margin: YES`);
        }

        if (distance < minDistance) {
          minDistance = distance;
          closestPlace = location;
        }
      } else if (debug) {
        console.log(`Place: ${location.name} - Distance: lat=${distLat.toFixed(6)}, lng=${distLng.toFixed(6)} - Within margin: NO`);
      }
    });

    if (closestPlace !== null) {
      // Store in a const to preserve type narrowing in callbacks
      const placeToAdd: Place = closestPlace;
      setVisitedPlaces((prevVisitedPlaces) => {
        const visitedPlaces = [...prevVisitedPlaces, placeToAdd];
        saveVisitedPlaces(huntSlug, visitedPlaces);

        return visitedPlaces;
      });
      // Auto-select this new visited place
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

  return (
    <div style={{height: '100%', width: '100%'}} data-testid="map">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={16}
        style={{height: '100%', width: '100%'}}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />
        <AutocompleteControl
          coordinates={coordinates}
          onPlaceSelect={onPlaceSelect}
          onChange={() => setSelectedPlace(null)}
          onClear={() => setSelectedPlace(null)}
        />
        {visitedPlaces.map((visitedPlace, i) => {
          return (
            <MarkerWithPopup
              key={`marker-${i}`}
              place={visitedPlace}
              isSelected={selectedPlace === visitedPlace}
              isLatest={i === visitedPlaces.length - 1}
              onMarkerClick={() => setSelectedPlace(visitedPlace)}
              onCloseClick={() => setSelectedPlace(null)}
              data-testid={selectedPlace === visitedPlace ? "selected-marker" : `marker-${i}`}
            />
          )
        })}
      </MapContainer>
    </div>
  );
}
