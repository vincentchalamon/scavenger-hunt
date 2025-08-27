"use client";

import {Container} from "react-bootstrap";
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
  }, []);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  const apiClient = new RoutesApi(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
  const routeOptions = {
    travelMode: 'WALK',
    computeAlternativeRoutes: false,
    units: 'METRIC'
  };

  return (
    <Container className="px-0 pt-1 py-2">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          mapId="map-id"
          defaultCenter={origin}
          defaultZoom={16}
          style={{height: `${window.innerHeight - 120}px`}}
          fullscreenControl={false}
          gestureHandling={'greedy'}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          cameraControl={false}
        >
          <AutocompleteControl onPlaceSelect={setSelectedPlace}/>
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
    </Container>
  )
}
