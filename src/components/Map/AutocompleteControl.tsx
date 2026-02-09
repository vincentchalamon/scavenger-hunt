"use client";

import {Button, Container, Form, ListGroup} from "react-bootstrap";
import React, {FormEvent, FunctionComponent, useCallback, useEffect, useState} from "react";
import {useMap} from "react-leaflet";
import {OpenStreetMapProvider} from 'leaflet-geosearch';
import {FormControlProps} from "react-bootstrap/FormControl";
import {useTranslation} from "@/i18n";
import ReactDOM from "react-dom";

// Debounce delay for search input in milliseconds
const SEARCH_DEBOUNCE_MS = 500;

type SearchResult = {
  x: number;
  y: number;
  label: string;
  bounds: [[number, number], [number, number]] | null;
  raw: any;
}

type AutocompleteControlProps = {
  onPlaceSelect?: (result: SearchResult | null) => void;
  onClear?: () => void;
  coordinates: {lat: number; lng: number};
}

export const AutocompleteControl: FunctionComponent<AutocompleteControlProps & FormControlProps> = (props) => {
  const {onPlaceSelect = () => {}, onClear = () => {}, coordinates: locationBias, ...formControlProps} = props;
  const { t } = useTranslation();
  const map = useMap();
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const provider = useCallback(() => {
    return new OpenStreetMapProvider({
      params: {
        'accept-language': 'fr',
        countrycodes: 'fr',
        addressdetails: 1,
      },
    });
  }, []);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);
  
  const clearInput = useCallback(async () => {
    setInputValue('');
    setSuggestions([]);
    onClear();
  }, [onClear]);

  // Perform search when input changes
  useEffect(() => {
    if (inputValue.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await provider().search({ query: inputValue });
        setSuggestions(results as SearchResult[]);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS); // Use named constant for debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, provider]);

  const handleSuggestionClick = useCallback(
    async (suggestion: SearchResult) => {
      setInputValue(suggestion.label);
      setSuggestions([]);
      onPlaceSelect(suggestion);
    }, [onPlaceSelect]);

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

  // Use portal to render control outside of map container
  const controlContainer = map.getContainer();
  
  return ReactDOM.createPortal(
    <Container className="position-absolute top-0 start-50 translate-middle-x mt-3 p-0" style={{width: '280px', zIndex: 1000}}>
      <Form.Control
        // @ts-ignore
        type="search"
        placeholder={t('searchPlaceholder')}
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
      {suggestions.length > 0 && (
        <ListGroup style={{borderRadius: '0 0 20px 20px'}} data-testid="search-results">
          {suggestions.map((suggestion, i) => (
            <ListGroup.Item
              key={`suggestion-${i}`}
              action
              style={{fontSize: '14px', borderRadius: i === suggestions.length - 1 ? '0 0 15px 15px' : 0}}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> {suggestion.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>,
    controlContainer
  );
}
