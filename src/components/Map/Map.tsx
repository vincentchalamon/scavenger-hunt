"use client";

import {FunctionComponent, useEffect, useState} from "react";
import {APIProvider, Map as GoogleMap} from "@vis.gl/react-google-maps";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import Route from "@/components/Map/Route";
import {RoutesApi} from "@/components/Map/RoutesApi";

export const Map: FunctionComponent = () => {
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>({lat: 50.6369375, lng: 3.0608454});
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      setOrigin({lat: coords.latitude, lng: coords.longitude});
    })
  }, [navigator.geolocation]);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  const apiClient = new RoutesApi(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
  const routeOptions = {
    travelMode: 'WALK',
    computeAlternativeRoutes: false,
    units: 'METRIC'
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapId="map-id"
        defaultCenter={origin}
        defaultZoom={16}
        fullscreenControl={false}
        gestureHandling={'greedy'}
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        cameraControl={false}
      >
        <AutocompleteControl onPlaceSelect={setSelectedPlace} onClear={() => setSelectedPlace(null)}/>
        {selectedPlace && selectedPlace.location && (
          <>
            <Route
              apiClient={apiClient}
              origin={origin}
              destination={selectedPlace.location.toJSON()}
              routeOptions={routeOptions}
            />
          </>
        )}
      </GoogleMap>
    </APIProvider>
  )
}
