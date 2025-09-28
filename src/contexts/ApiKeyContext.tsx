import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {RoutesApi} from "@/components/Map/RoutesApi";

export const ApiKeyContext = createContext({
  apiKey: undefined,
  setApiKey: (_apiKey: string) => {},
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (typeof process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === "string") {
      // For development purpose
      setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    } else if (typeof localStorage !== "undefined") {
      // For production purpose
      setApiKey(localStorage.getItem("apiKey") || undefined);
    }
  }, []);

  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const onSubmit = (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Validate API Key
    const apiClient = new RoutesApi(form[0].value);
    apiClient.computeRoutes(
      {
        lat: 50.6382135,
        lng: 3.0637474,
      },
      {
        lat: 50.641385799999995,
        lng: 3.0632544,
      },
      {
        travelMode: 'WALK',
        computeAlternativeRoutes: false,
        units: 'METRIC',
      },
    ).then(
      () => {
        // Save valid API Key and store it in localStorage
        setApiKey(form[0].value);
        localStorage.setItem("apiKey", form[0].value);
        setIsValid(true);
      },
      () => setIsValid(false)
    );
  };

  if (typeof apiKey === "undefined") {
    return (
      <ApiKeyContext.Provider value={{apiKey, setApiKey}}>
        <Container className="px-4 py-5">
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="h3 mb-3">Clé d'accès</Form.Label>
              <Form.Text className="text-white d-block mb-3">Veuillez renseigner la clé d'accès fournie par votre hôte.</Form.Text>
              <Form.Control required type="text" placeholder="Clé d'accès" />
              {isValid === false && (
                <Form.Text className="text-danger d-block mt-3">La clé saisie semble invalide. Merci de vérifier votre saisie.</Form.Text>
              )}
            </Form.Group>
            {/*@ts-ignore*/}
            <Button variant="primary" type="submit">Enregistrer</Button>
          </Form>
        </Container>
      </ApiKeyContext.Provider>
    );
  }

  return (
    // @ts-ignore
    <ApiKeyContext.Provider value={{apiKey, setApiKey}}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = (): string => {
  const context = useContext(ApiKeyContext);
  if (!context || typeof context.apiKey === "undefined") {
    throw new Error("API Key is not defined.");
  }

  return context.apiKey;
};
