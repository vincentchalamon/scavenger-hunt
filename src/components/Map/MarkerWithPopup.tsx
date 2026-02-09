"use client";

import React, {useEffect, useRef} from "react";
import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import {Place} from "@/types/Place";
import {Button, Container} from "react-bootstrap";
import {RenderButton, RenderItem} from "@/components/Items/ItemFactory";
import {ModalItem} from "@/components/Items/ModalItem";

// Fix for default marker icon in Leaflet with webpack
// This needs to be done client-side only
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Create custom icons for different marker states
const createCustomIcon = (isLatest: boolean) => {
  const color = isLatest ? '#dc3545' : 'rgba(60, 60, 60, 0.6)';
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 1.867.41 3.638 1.138 5.231L12.5 41l11.362-23.269c.728-1.593 1.138-3.364 1.138-5.231C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="7" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41]
  });
};

export const MarkerWithPopup = (props: {
  onMarkerClick: () => void;
  onCloseClick: () => void;
  isSelected: boolean;
  isLatest: boolean;
  place: Place;
  "data-testid"?: string;
}) => {
  const {onMarkerClick, onCloseClick, isSelected, isLatest, place} = props;
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    } else if (!isSelected && markerRef.current) {
      markerRef.current.closePopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[place.coordinates.lat, place.coordinates.lng]}
      icon={createCustomIcon(isLatest)}
      eventHandlers={{
        click: () => {
          onMarkerClick();
        }
      }}
    >
      <Popup
        closeButton={true}
        maxWidth={500}
        minWidth={280}
        className="map-popup"
        eventHandlers={{
          popupclose: () => onCloseClick()
        }}
      >
        <Container className="bg-white text-dark p-0 m-0 pb-2 pe-2">
          <h5 className="text-dark mb-2">{place.name}</h5>
          <div style={{
            textAlign: "justify",
            textJustify: "inter-word",
          }} dangerouslySetInnerHTML={{__html: place.description}}/>
          {place.link && (
            // @ts-ignore
            <Button href={place.link} target="_blank" className="mt-2">Découvrez son histoire</Button>
          )}
          {place.item?.type && (
            <>
              <hr/>
              <p style={{
                textAlign: "justify",
                textJustify: "inter-word",
                fontWeight: "bolder",
              }}><strong>Allez sur place, puis cliquer sur l'image ci-dessous pour accéder à la prochaine énigme.</strong></p>
              <ModalItem button={
                // @ts-ignore
                <Button variant="link" className="p-0 m-0 w-100 h-100">
                  <RenderButton {...place.item}/>
                </Button>
              }>
                <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
                  <RenderItem {...place.item}/>
                </div>
              </ModalItem>
            </>
          )}
        </Container>
      </Popup>
    </Marker>
  );
}
