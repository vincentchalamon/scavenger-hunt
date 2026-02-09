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
  useEffect(() => {
    const alreadyVisitedPlaces = getVisitedPlaces<Place>(huntSlug, [places[0]]);
    setVisitedPlaces(alreadyVisitedPlaces);
    // On Map load, auto-select the latest visited place
    setSelectedPlace(alreadyVisitedPlaces[alreadyVisitedPlaces.length - 1]);
  }, [huntSlug]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const onPlaceSelect = (result: SearchResult | null) => {
    if (!result) return;

    // Look for place in configuration based on it's coordinates
    // Note: it's possible to search for all places through the geocoding service, but only select a place from the configuration
    const location = places.find((location) =>
      location.coordinates.lat.toFixed(7) === result.y.toFixed(7) &&
      location.coordinates.lng.toFixed(7) === result.x.toFixed(7)
    );

    if (location) {
      setVisitedPlaces((prevVisitedPlaces) => {
        const visitedPlaces = [...prevVisitedPlaces, location];
        saveVisitedPlaces(huntSlug, visitedPlaces);
        // Auto-select this new visited place
        setSelectedPlace(location);

        return visitedPlaces;
      });
      setMapCenter(location.coordinates);
    } else {
      addToast(t('placeNotInGame'), "danger");
      if (debug) {
        console.log(places, {lat: result.y, lng: result.x});
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
