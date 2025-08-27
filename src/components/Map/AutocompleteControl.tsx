"use client";

import {Container, Form, ListGroup} from "react-bootstrap";
import {FormEvent, FunctionComponent, useCallback, useState} from "react";
import {ControlPosition, MapControl, useMapsLibrary} from "@vis.gl/react-google-maps";
import {useAutocompleteSuggestions} from "@/hooks/use-autocomplete-suggestions";

interface AutocompleteControlProps {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

export const AutocompleteControl: FunctionComponent<AutocompleteControlProps> = ({onPlaceSelect}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const places = useMapsLibrary('places');
  const {suggestions, resetSession} = useAutocompleteSuggestions(inputValue);
  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

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
    }, [places, onPlaceSelect]);

  const inputStyle = {
    boxSizing: 'border-box',
    borderWidth: suggestions.length ? '1px 1px 0 1px' : '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: '#1f1f1f',
    height: '40px',
    lineHeight: '40px',
    padding: '15px 20px',
    borderRadius: suggestions.length ? '15px 15px 0 0' : '30px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    fontSize: '15px',
    outline: 'none',
    textOverflow: 'ellipses',
  }

  return (
    <MapControl position={ControlPosition.TOP_CENTER}>
      <Container className="mt-3 p-0" style={{width: '252px'}}>
        <Form.Control
          type="search"
          placeholder="Rechercher dans Google Maps"
          value={inputValue}
          // @ts-ignore
          onInput={(event) => handleInput(event)}
          // @ts-ignore
          style={inputStyle}/>
        {suggestions && <ListGroup style={{borderRadius: '0 0 20px 20px'}}>
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item
              key={index}
              action
              style={{fontSize: '14px', borderRadius: index === suggestions.length-1 ? '0 0 15px 15px' : 0}}
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
