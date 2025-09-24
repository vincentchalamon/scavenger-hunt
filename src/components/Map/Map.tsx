"use client";

import React, {useContext, useState} from "react";
import {AdvancedMarkerAnchorPoint, APIProvider, Map as GoogleMap} from "@vis.gl/react-google-maps";
import {AutocompleteControl} from "@/components/Map/AutocompleteControl";
import Route from "@/components/Map/Route";
import {RoutesApi} from "@/components/Map/RoutesApi";
import {Place} from "@/types/Place";
import {Button, Container} from "react-bootstrap";
import {ItemFactory, ModalItem} from "@/components/Items";
import {AdvancedMarkerWithRef} from "@/components/Map/AdvancedMarkerWithRef";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

type MapProps = {
  places: Place[];
}

export const Map: React.FC<MapProps> = ({places}) => {
  // Store all visited places to trace a route in the map
  // Preset first place
  const [visitedPlaces, setVisitedPlaces] = useState<Place[]>(places.length ? [places[0]] : []);
  const onPlaceSelect = (place: google.maps.places.Place | null) => {
    // Look for place in configuration based on it's coordinates
    // Note: it's possible to search for all places through GoogleMap, but only select a place from the configuration
    const location = places.find((location) => location.coordinates.lat === place?.location?.toJSON().lat && location.coordinates.lng === place?.location?.toJSON().lng);
    if (location) {
      setVisitedPlaces([...visitedPlaces, location]);
    } else {
      console.log(place?.location?.toJSON());
    }
  };

  // Can't call "useContext" in item because of React limitations
  const {keywords, setKeywords} = useContext(PhraseContext);
  const {setToast} = useContext(ToastContext);
  const onKeywordClicked = (keyword: string) => {
    // @ts-ignore
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword].filter((value, index, self) => self.indexOf(value) === index));
      setToast('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
    }
  }

  // Configure and show GoogleMap with a route of all visited places
  const apiClient = new RoutesApi(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapId="map-id"
        defaultCenter={visitedPlaces[0].coordinates}
        defaultZoom={16}
        gestureHandling={'greedy'}
        disableDefaultUI
        zoomControl={true}
        onClick={() => setSelectedPlace(null)}
      >
        <AutocompleteControl
          onPlaceSelect={onPlaceSelect}
          onChange={() => setSelectedPlace(null)}
          onClear={() => setSelectedPlace(null)}
        />
        {visitedPlaces.map((visitedPlace, i) => {
          const item = ItemFactory.create({...visitedPlace.item, options: {...visitedPlace.item.options, onKeywordClicked}});

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
                position={visitedPlace.coordinates}
                title={visitedPlace.name}
              >
                <Container className="bg-white text-dark p-0 m-0 pb-2 pe-2">
                  <div style={{
                    textAlign: "justify",
                    textJustify: "inter-word",
                  }} dangerouslySetInnerHTML={{__html: visitedPlace.description}}/>
                  {visitedPlace.link && (
                    <Button href={visitedPlace.link} target="_blank">Découvrez son histoire</Button>
                  )}
                  <hr/>
                  <ModalItem button={
                    <Button variant="link" className="p-0 m-0 w-100 h-100">
                      {item.renderImage()}
                    </Button>
                  }>
                    <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
                      {item.render()}
                    </div>
                  </ModalItem>
                </Container>
              </AdvancedMarkerWithRef>
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
