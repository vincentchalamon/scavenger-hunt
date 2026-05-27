"use client";

import {Button, Form, ListGroup} from "react-bootstrap";
import React, {FormEvent, FunctionComponent, useCallback, useEffect, useState} from "react";
import {useMap} from "react-leaflet";
import {OpenStreetMapProvider} from 'leaflet-geosearch';
import {FormControlProps} from "react-bootstrap/FormControl";
import {useTranslation} from "@/i18n";
import {Place} from "@/types/Place";
import {Icon} from "@/components/UI";
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
  places?: Place[];
}

export const AutocompleteControl: FunctionComponent<AutocompleteControlProps & FormControlProps> = (props) => {
  const {onPlaceSelect = () => {}, onClear = () => {}, coordinates: locationBias, places = [], ...formControlProps} = props;
  const { t, language } = useTranslation();
  const map = useMap();
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const provider = useCallback(() => {
    return new OpenStreetMapProvider({
      params: {
        'accept-language': language,
        countrycodes: 'fr',
        addressdetails: 1,
      },
    });
  }, [language]);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const handleFocus = useCallback(() => {}, []);

  const clearInput = useCallback(async () => {
    setInputValue('');
    setSuggestions([]);
    onClear();
  }, [onClear]);

  // Perform search when input changes
  useEffect(() => {
    // Don't search if we're setting the value from a selection
    if (isSelecting) {
      setIsSelecting(false);

      return;
    }

    if (inputValue.length < 3) {
      setSuggestions([]);

      return;
    }

    // Local search: match game places by name first
    const query = inputValue.toLowerCase();
    const localResults: SearchResult[] = places
      .filter((place) => place.name.toLowerCase().includes(query))
      .map((place) => ({
        x: place.coordinates.lng,
        y: place.coordinates.lat,
        label: place.name,
        bounds: null,
        raw: {local: true},
      }));

    // If we have local matches, show them immediately
    if (localResults.length > 0) {
      setSuggestions(localResults);
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await provider().search({ query: inputValue });
        // Merge: local results first, then OSM results (deduplicated)
        const osmResults = (results as SearchResult[]).filter(
          (r) => !localResults.some((lr) => Math.abs(lr.x - r.x) < 0.001 && Math.abs(lr.y - r.y) < 0.001)
        );
        setSuggestions([...localResults, ...osmResults]);
      } catch (error) {
        console.error('Search error:', error);
        if (localResults.length === 0) setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [inputValue, provider]); // Do not listen to "isSelecting" to avoid infinite loop when selecting a suggestion

  const handleSuggestionClick = useCallback(
    async (suggestion: SearchResult) => {
      setIsSelecting(true);
      setInputValue(suggestion.label);
      setSuggestions([]);
      onPlaceSelect(suggestion);
    }, [onPlaceSelect]);

  const inputStyle = {
    boxSizing: 'border-box',
    border: '1px solid var(--color-hairline)',
    borderBottom: suggestions.length ? 'none' : '1px solid var(--color-hairline)',
    background: 'var(--color-surface)',
    color: 'var(--color-ink)',
    height: '42px',
    padding: '0 38px 0 40px',
    borderRadius: suggestions.length ? '14px 14px 0 0' : '14px',
    boxShadow: 'var(--shadow-md)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    textOverflow: 'ellipsis',
  }

  // Use portal to render control outside of map container
  const controlContainer = map.getContainer();

  return ReactDOM.createPortal(
    <div style={{position: 'absolute', top: '12px', left: '54px', right: '60px', zIndex: 600}}>
      <div style={{position: 'absolute', left: '14px', top: '13px', zIndex: 1, pointerEvents: 'none'}}>
        <Icon.Search size={15} color="var(--color-ink-mute)" strokeWidth={2} />
      </div>
      <Form.Control
        // @ts-ignore
        type="search"
        placeholder={t('searchPlaceholder')}
        value={inputValue}
        // @ts-ignore
        onInput={(event) => handleInput(event)}
        onFocus={handleFocus}
        // @ts-ignore
        style={inputStyle}
        data-testid="search-field"
        {...formControlProps}
      />
      {/*@ts-ignore*/}
      <Button type="button" className="btn-close position-absolute" style={{top: '12px', right: '12px'}} onClick={clearInput}/>
      {suggestions.length > 0 && (
        <ListGroup
          style={{borderRadius: '0 0 14px 14px', border: '1px solid var(--color-hairline)', borderTop: 'none', overflow: 'hidden', boxShadow: 'var(--shadow-md)'}}
          data-testid="search-results"
        >
          {suggestions.map((suggestion, i) => (
            <ListGroup.Item
              key={`suggestion-${i}`}
              action
              style={{fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--color-ink)', border: 'none', borderTop: i === 0 ? 'none' : '1px solid var(--color-hairline)'}}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Icon.Pin size={14} color="var(--color-ink-mute)" strokeWidth={1.8} /> {suggestion.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>,
    controlContainer
  );
}
