"use client";

import React, {useEffect, useState} from "react";
import {AdvancedMarkerAnchorPoint, APIProvider, Map as GoogleMap} from "@vis.gl/react-google-maps";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import {RoutesApi} from "@/components/Map/RoutesApi";
import {Place} from "@/types/Place";
import {AdvancedMarkerWithRef} from "@/components/Map/AdvancedMarkerWithRef";
import {ItemOptionsType} from "@/types/Item";
import {useApiKey} from "@/contexts/ApiKeyContext";

type MapProps = ItemOptionsType & {
  places: Place[];
  coordinates: google.maps.LatLngLiteral;
}

export const Map: React.FC<MapProps> = ({places, coordinates}) => {
  // Retrieve Google Maps API Key
  const apiKey = useApiKey();
  // Store all visited places to trace a route in the map
  // Preset first place
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>([places[0]]);
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setVisitedPlaces(JSON.parse(localStorage.getItem("places") || JSON.stringify(visitedPlaces)));
    }
  }, []);
  const onPlaceSelect = (place: google.maps.places.Place | null) => {
    // Look for place in configuration based on it's coordinates
    // Note: it's possible to search for all places through GoogleMap, but only select a place from the configuration
    const location = places.find((location) => location.coordinates.lat.toFixed(7) === place?.location?.toJSON().lat.toFixed(7) && location.coordinates.lng.toFixed(7) === place?.location?.toJSON().lng.toFixed(7));
    if (location) {
      setVisitedPlaces((prevVisitedPlaces) => {
        const visitedPlaces = [...prevVisitedPlaces, location];
        localStorage.setItem("places", JSON.stringify(visitedPlaces));

        return visitedPlaces;
      });
      setMapCenter(location.coordinates);
    } else {
      console.log(
        places,
        place?.location?.toJSON()
      );
    }
  };
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Helps to center map on new marker added
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(visitedPlaces[0].coordinates);

  // Configure and show GoogleMap with a route of all visited places
  const apiClient = new RoutesApi(apiKey);

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap
        mapId="map-id"
        center={mapCenter}
        onCenterChanged={(map) => setMapCenter(map.detail.center)}
        defaultZoom={16}
        gestureHandling={'greedy'}
        disableDefaultUI
        zoomControl={true}
        onClick={() => setSelectedPlace(null)}
      >
        <AutocompleteControl
          coordinates={coordinates}
          onPlaceSelect={onPlaceSelect}
          onChange={() => setSelectedPlace(null)}
          onClear={() => setSelectedPlace(null)}
        />
        {visitedPlaces.map((visitedPlace, i) => {
          return (
            <div key={`marker-${i}`}>
              <AdvancedMarkerWithRef
                onMarkerClick={() => setSelectedPlace(visitedPlace)}
                onCloseClick={() => setSelectedPlace(null)}
                showInfo={selectedPlace === visitedPlace}
                style={{
                  transition: "all 200ms ease-in-out",
                  transform: "scale(1)",
                  transformOrigin: AdvancedMarkerAnchorPoint['BOTTOM'].join(' ')
                }}
                place={visitedPlace}
              />
              {/*TODO fix route with polyline*/}
              {/*{i > 0 && (*/}
              {/*  <Route*/}
              {/*    apiClient={apiClient}*/}
              {/*    origin={visitedPlaces[i - 1].coordinates}*/}
              {/*    destination={visitedPlace.coordinates}*/}
              {/*    routeOptions={{travelMode: 'WALK', computeAlternativeRoutes: false, units: 'METRIC'}}*/}
              {/*  />*/}
              {/*)}*/}
            </div>
          )
        })}
      </GoogleMap>
    </APIProvider>
  );
}
