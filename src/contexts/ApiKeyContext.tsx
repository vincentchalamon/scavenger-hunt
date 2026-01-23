import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Alert, Button, Container, Form} from "react-bootstrap";
import {useTranslation} from "@/i18n";
import {decryptApiKey} from "@/lib/crypto";

export const ApiKeyContext = createContext({
  apiKey: undefined,
  setApiKey: (_apiKey: string) => {},
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [encryptedKey, setEncryptedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);

  useEffect(() => {
    // Development mode: use env variable
    if (typeof process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === "string") {
      setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
      setIsLoading(false);
      return;
    }

    // Production mode: load encrypted key
    // The basePath may vary depending on deployment:
    // - GitHub Pages: https://username.github.io/repo-name/ (basePath = /repo-name)
    // - Custom domain: https://scavenger-hunts.fr/ (basePath = empty)
    // - Local test: http://localhost:3000/ (basePath = empty)
    const getBasePath = () => {
      if (typeof window === 'undefined') return '';

      const hostname = window.location.hostname;
      const pathname = window.location.pathname;

      // Local development or custom domain at root - no basePath
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
        return '';
      }

      // Check if we're on GitHub Pages with a subdirectory
      // GitHub Pages pattern: username.github.io/repo-name
      if (hostname.includes('.github.io')) {
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          // Return the first segment as basePath (repo name)
          return `/${pathSegments[0]}`;
        }
      }

      // Custom domain without subdirectory - no basePath
      return '';
    };

    const basePath = getBasePath();
    const encryptedKeyPath = `${basePath}/encrypted-api-key.txt`;

    fetch(encryptedKeyPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Encrypted key not found');
        }
        return response.text();
      })
      .then(encrypted => {
        setEncryptedKey(encrypted.trim());
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load encrypted API key:', error);
        setIsLoading(false);
      });
  }, []);

  const [isDecrypting, setIsDecrypting] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = form[0].value;

    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      // Decrypt the API key
      if (!encryptedKey) {
        throw new Error('No encrypted key available');
      }

      const decryptedKey = await decryptApiKey(encryptedKey, password);

      // Save valid API Key (don't store it in localStorage for security)
      setApiKey(decryptedKey);
    } catch (error: any) {
      console.error('Decryption or validation failed:', error);
      if (error.message.includes('Decryption failed')) {
        setDecryptionError(t('passwordInvalid') || 'Invalid password');
      } else {
        setDecryptionError(t('apiKeyInvalid') || 'Invalid API key');
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="px-4 py-5">
        <div className="text-white text-center">
          <h3>{t('loading') || 'Loading...'}</h3>
        </div>
      </Container>
    );
  }

  if (typeof apiKey === "undefined" && encryptedKey) {
    const decryptingText: string = t('decrypting');
    const unlockText: string = t('unlock');
    const buttonText: string = isDecrypting ? decryptingText : unlockText;

    return (
      <ApiKeyContext.Provider value={{apiKey, setApiKey}}>
        <Container className="px-4 py-5">
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="h3 mb-3">{t('passwordLabel')}</Form.Label>
              <Form.Text className="text-white d-block mb-3">
                {t('passwordHelper')}
              </Form.Text>
              <Form.Control
                required
                type="password"
                placeholder={t('passwordPlaceholder')}
                disabled={isDecrypting}
              />
              {decryptionError && (
                <Alert variant="danger" className="mt-3">
                  {decryptionError}
                </Alert>
              )}
            </Form.Group>
            {/*@ts-ignore*/}
            <Button variant="primary" type="submit" disabled={isDecrypting}>
              {buttonText}
            </Button>
          </Form>
        </Container>
      </ApiKeyContext.Provider>
    );
  }

  // If no encrypted key and no dev API key, show error
  if (typeof apiKey === "undefined") {
    return (
      <ApiKeyContext.Provider value={{apiKey, setApiKey}}>
        <Container className="px-4 py-5">
          <Alert variant="danger">
            <Alert.Heading>{t('error')}</Alert.Heading>
            <p>{t('noEncryptedKey')}</p>
          </Alert>
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
