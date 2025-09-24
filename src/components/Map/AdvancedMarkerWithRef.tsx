"use client";

import React from "react";
import {AdvancedMarker, AdvancedMarkerProps, InfoWindow, Pin, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";

export const AdvancedMarkerWithRef = (props: AdvancedMarkerProps & {
  onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  onCloseClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  showInfo: boolean;
  title: string;
}) => {
  const {children, onMarkerClick, onCloseClick, showInfo, title, ...advancedMarkerProps} = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      <Pin/>
      {showInfo && (
        <InfoWindow
          anchor={marker}
          headerContent={<h5 className="text-dark">{title}</h5>}
          pixelOffset={[0, -2]}
          onCloseClick={() => {
            if (marker) {
              onCloseClick(marker);
            }
          }}>
          {children}
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
}
