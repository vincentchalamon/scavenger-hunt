import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {RoutesApi} from "@/components/Map/RoutesApi";
import {useTranslation} from "@/i18n";

export const ApiKeyContext = createContext({
  apiKey: undefined,
  setApiKey: (_apiKey: string) => {},
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (typeof process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === "string") {
      // For development purpose
      setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    }

    // For production purpose
    if (typeof localStorage !== "undefined" && localStorage.getItem("api-key")) {
      setApiKey(localStorage.getItem("api-key") as string);
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
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("api-key", form[0].value);
        }
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
              <Form.Label className="h3 mb-3">{t('apiKeyLabel')}</Form.Label>
              <Form.Text className="text-white d-block mb-3">{t('apiKeyHelper')}</Form.Text>
              <Form.Control required type="password" placeholder={t('apiKeyPlaceholder')} />
              {isValid === false && (
                <Form.Text className="text-danger d-block mt-3">{t('apiKeyInvalid')}</Form.Text>
              )}
            </Form.Group>
            {/*@ts-ignore*/}
            <Button variant="primary" type="submit">{t('apiKeySave')}</Button>
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
