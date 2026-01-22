"use client";

import {Button, Container, Form, ListGroup} from "react-bootstrap";
import React, {FormEvent, FunctionComponent, useCallback, useState} from "react";
import {ControlPosition, MapControl, useMapsLibrary} from "@vis.gl/react-google-maps";
import {useAutocompleteSuggestions} from "@/hooks/use-autocomplete-suggestions";
import {FormControlProps} from "react-bootstrap/FormControl";

type AutocompleteControlProps = {
  onPlaceSelect?: (place: google.maps.places.Place | null) => void;
  onClear?: () => void;
  coordinates: google.maps.LatLngLiteral;
}

export const AutocompleteControl: FunctionComponent<AutocompleteControlProps & FormControlProps> = (props) => {
  const {onPlaceSelect = () => {}, onClear = () => {}, coordinates: locationBias, ...formControlProps} = props;
  const [inputValue, setInputValue] = useState<string>('');
  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);
  const clearInput = useCallback(async () => {
    setInputValue('');
    onClear();
  }, [inputValue]);

  const places = useMapsLibrary('places');
  const {suggestions, resetSession} = useAutocompleteSuggestions(inputValue, {locationBias});
  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places || !suggestion.placePrediction) {
        return;
      }

      setInputValue(suggestion.placePrediction.text.text);

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: [
          'viewport',
          'location',
          'svgIconMaskURI',
          'iconBackgroundColor'
        ]
      });

      resetSession();
      onPlaceSelect(place);
    }, [places]);

  const inputStyle = {
    boxSizing: 'border-box',
    borderWidth: suggestions.length ? '1px 1px 0 1px' : '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: '#1f1f1f',
    height: '40px',
    lineHeight: '40px',
    padding: '15px 40px 15px 20px',
    borderRadius: suggestions.length ? '15px 15px 0 0' : '30px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    fontSize: '15px',
    outline: 'none',
    textOverflow: 'ellipses',
  }

  return (
    <MapControl position={ControlPosition.TOP_CENTER}>
      <Container className="mt-3 p-0 position-relative" style={{width: '280px'}}>
        <Form.Control
          // @ts-ignore
          type="search"
          placeholder="Rechercher un lieu..."
          value={inputValue}
          // @ts-ignore
          onInput={(event) => handleInput(event)}
          // @ts-ignore
          style={inputStyle}
          data-testid="search-field"
          {...formControlProps}
        />
        {/*@ts-ignore*/}
        <Button type="button" className="btn-close position-absolute" style={{top: '8px', right: '10px'}} onClick={clearInput}/>
        {suggestions && <ListGroup style={{borderRadius: '0 0 20px 20px'}} data-testid="search-results">
          {suggestions.map((suggestion, i) => (
            <ListGroup.Item
              key={`suggestion-${i}`}
              action
              style={{fontSize: '14px', borderRadius: i === suggestions.length - 1 ? '0 0 15px 15px' : 0}}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> {suggestion.placePrediction?.text.text}
            </ListGroup.Item>
          ))}
        </ListGroup>}
      </Container>
    </MapControl>
  )
}
