"use client";

import React from "react";
import {AdvancedMarker, AdvancedMarkerProps, InfoWindow, Pin, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {Place} from "@/types/Place";
import {Button, Container} from "react-bootstrap";
import {Item as AbstractItem, ItemFactory, ModalItem} from "@/components/Items";

export const AdvancedMarkerWithRef = (props: Omit<AdvancedMarkerProps, "children"> & {
  onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  onCloseClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  showInfo: boolean;
  place: Place;
}) => {
  const {onMarkerClick, onCloseClick, showInfo, place, ...advancedMarkerProps} = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      position={place.coordinates}
      {...advancedMarkerProps}
    >
      <Pin/>
      {showInfo && (
        <InfoWindow
          anchor={marker}
          headerContent={<h5 className="text-dark">{place.name}</h5>}
          pixelOffset={[0, -2]}
          onCloseClick={() => {
            if (marker) {
              onCloseClick(marker);
            }
          }}>
          <Container className="bg-white text-dark p-0 m-0 pb-2 pe-2">
            <div style={{
              textAlign: "justify",
              textJustify: "inter-word",
            }} dangerouslySetInnerHTML={{__html: place.description}}/>
            {place.link && (
              <Button href={place.link} target="_blank">Découvrez son histoire</Button>
            )}
            {place.item?.type && (
              <Item item={ItemFactory.create(place.item)}/>
            )}
          </Container>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
}

const Item = ({item}: {item: AbstractItem}) => (
  <>
    <hr/>
    <ModalItem button={
      // @ts-ignore
      <Button variant="link" className="p-0 m-0 w-100 h-100">
        {item.renderImage()}
      </Button>
    }>
      <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
        {item.render()}
      </div>
    </ModalItem>
  </>
);
