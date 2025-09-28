"use client";

import React, {useEffect, useState} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {RoutesApi} from "@/components/Map/RoutesApi";
import {Polyline} from "@/components/Map/Polyline";

type RouteProps = {
  apiClient: RoutesApi;
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  routeOptions?: any;
}

const Route: React.FC<RouteProps> = ({apiClient, origin, destination, routeOptions}) => {
  const [route, setRoute] = useState<any>(null);

  const map = useMap();
  useEffect(() => {
    if (!map) {
      return;
    }

    apiClient.computeRoutes(origin, destination, routeOptions).then(res => {
      // We're only interested in the first result for this case
      const [route] = res.routes;

      // Store in state and trigger rerendering
      setRoute(route);

      // Fit map to the viewport returned from the API
      const {high, low} = route.viewport;
      map.fitBounds({
        north: high.latitude,
        south: low.latitude,
        east: high.longitude,
        west: low.longitude
      });
    });
  }, [origin, destination, routeOptions]);

  return route?.legs[0].steps.map((step: google.maps.DirectionsStep, index: number) => (
    <Polyline
      key={`polyline-${index}`}
      encodedPath={step.encoded_lat_lngs}
      strokeWeight={2}
      strokeOpacity={0}
      icons={[{
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#C83939',
          fillOpacity: 1,
          scale: 2,
          strokeColor: '#C83939',
          strokeOpacity: 1,
        },
        offset: '0',
        repeat: '10px'
      }]}
    />
  ));
};

export default React.memo(Route);
