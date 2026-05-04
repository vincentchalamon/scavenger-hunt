"use client";

import React, {useEffect, useRef} from "react";
import {Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet";
import {Place} from "@/types/Place";
import {Button, Container} from "react-bootstrap";
import {RenderButton, RenderItem} from "@/components/Items/ItemFactory";
import {ModalItem} from "@/components/Items/ModalItem";
import {useTranslation} from "@/i18n";

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
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41]
  });
};

export const MarkerWithPopup = (props: {
  onMarkerClick: () => void;
  onCloseClick: () => void;
  onItemModalClose?: () => void;
  isSelected: boolean;
  isLatest: boolean;
  shouldOpenPopup: boolean;
  place: Place;
  isFirst?: boolean;
  "data-testid"?: string;
}) => {
  const {onMarkerClick, onCloseClick, onItemModalClose, isSelected, isLatest, shouldOpenPopup, place, isFirst} = props;
  const {t} = useTranslation();
  const markerRef = useRef<L.Marker>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const map = useMap();
  const [popupMaxWidth, setPopupMaxWidth] = React.useState(280);

  // Calculate popup max width based on screen width
  useEffect(() => {
    const calculateMaxWidth = () => {
      const screenWidth = window.innerWidth;
      // Use 80% of screen width with a maximum of 400px and minimum of 240px
      const calculatedWidth = Math.min(Math.max(screenWidth * 0.8, 240), 400);
      setPopupMaxWidth(calculatedWidth);
    };

    calculateMaxWidth();
    window.addEventListener('resize', calculateMaxWidth);

    return () => {
      window.removeEventListener('resize', calculateMaxWidth);
    };
  }, []);

  // Allow the onboarding tour to open/close the popup on the first marker
  useEffect(() => {
    if (!isFirst) return;
    const open = () => markerRef.current?.openPopup();
    const close = () => markerRef.current?.closePopup();
    window.addEventListener('onboarding:open-first-marker', open);
    window.addEventListener('onboarding:close-first-marker', close);
    return () => {
      window.removeEventListener('onboarding:open-first-marker', open);
      window.removeEventListener('onboarding:close-first-marker', close);
    };
  }, [isFirst]);

  // Open popup only when shouldOpenPopup is true (search selection)
  useEffect(() => {
    if (shouldOpenPopup && markerRef.current) {
      // Delay popup opening to ensure map is fully rendered
      setTimeout(() => {
        if (markerRef.current) {
          markerRef.current.openPopup();

          // Additional delay to ensure popup content is fully rendered
          // before forcing a position update
          setTimeout(() => {
            if (popupRef.current && markerRef.current) {
              // Force popup to recalculate its position now that content is loaded
              popupRef.current.update();
            }
          }, 200);
        }
      }, 100);
    } else if (!isSelected && markerRef.current) {
      markerRef.current.closePopup();
    }
  }, [shouldOpenPopup, isSelected, map]);

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
        ref={(popup) => {
          popupRef.current = popup;
        }}
        closeButton={true}
        maxWidth={popupMaxWidth}
        minWidth={Math.min(240, popupMaxWidth)}
        className="map-popup"
        autoPan={true}
        autoPanPadding={[50, 50]}
        offset={[0, 0]}
        eventHandlers={{
          popupclose: () => onCloseClick()
        }}
      >
        <Container className="bg-white text-dark" style={{maxWidth: '100%', minWidth: Math.min(240, popupMaxWidth) + 'px'}}>
          <h5 className="text-dark mb-2">{place.name}</h5>
          <div style={{
            textAlign: "justify",
            textJustify: "inter-word",
          }} dangerouslySetInnerHTML={{__html: place.description}}/>
          {place.link && (
            // @ts-ignore
            <Button href={place.link} target="_blank" className="mt-2 d-block mx-auto">{t('markerLinkButton')}</Button>
          )}
          {place.item?.type && (
            <>
              <hr/>
              <p style={{
                textAlign: "justify",
                textJustify: "inter-word",
                fontWeight: "bolder",
              }}><strong>{t('markerPlaceInstructions')}</strong></p>
              <ModalItem onHide={onItemModalClose} button={
                // @ts-ignore
                <Button variant="link" className="p-0 m-0" data-testid="place-item-trigger" style={{maxWidth: '100%', display: 'block'}}>
                  <div style={{maxWidth: '100%', overflow: 'hidden'}}>
                    <RenderButton {...place.item}/>
                  </div>
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
