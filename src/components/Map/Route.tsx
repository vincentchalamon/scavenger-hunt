import React, {useEffect, useState} from 'react';
import {AdvancedMarker, useMap} from '@vis.gl/react-google-maps';

import {RoutesApi} from "@/components/Map/RoutesApi";
import {Polyline} from "@/components/Map/Polyline";

export type RouteProps = {
  apiClient: RoutesApi;
  origin: {lat: number; lng: number};
  destination: {lat: number; lng: number};
  routeOptions?: any;
};

const Route = (props: RouteProps) => {
  const {apiClient, origin, destination, routeOptions} = props;

  const [route, setRoute] = useState<any>(null);

  const map = useMap();
  useEffect(() => {
    if (!map) return;

    apiClient.computeRoutes(origin, destination, routeOptions).then(res => {
      // we're only interested in the first result for this case
      const [route] = res.routes;

      // store in state and trigger rerendering
      setRoute(route);

      // fit map to the viewport returned from the API
      const {high, low} = route.viewport;
      const bounds: google.maps.LatLngBoundsLiteral = {
        north: high.latitude,
        south: low.latitude,
        east: high.longitude,
        west: low.longitude
      };

      map.fitBounds(bounds);
    });
  }, [origin, destination, routeOptions]);

  if (!route) return null;

  const routeSteps: any[] = route.legs[0].steps;

  const polylines = routeSteps.map((step, index) => {
    return (
      <Polyline
        key={`${index}-polyline`}
        encodedPath={step.polyline.encodedPolyline}
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
    );
  });

  return (
    <>
      <AdvancedMarker position={origin} />
      <AdvancedMarker position={destination} />
      {polylines}
    </>
  );
};

export default React.memo(Route);
