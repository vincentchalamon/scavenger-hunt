"use client";

import {ReactNode} from "react";
import {I18nProvider} from "@/i18n";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
