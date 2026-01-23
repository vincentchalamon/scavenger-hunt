"use client";

import {ReactNode} from "react";
import {ApiKeyProvider} from "@/contexts/ApiKeyContext";
import {I18nProvider} from "@/i18n";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      <ApiKeyProvider>
        {children}
      </ApiKeyProvider>
    </I18nProvider>
  );
}
