import type {Metadata, Viewport} from "next";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/700.css";
import "../styles/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "driver.js/dist/driver.css";
import "./globals.css";
import {ReactNode} from "react";
import {Providers} from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "Scavenger Hunt",
  description: "Scavenger Hunt App",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
  return (
    <html style={{overscrollBehaviorY: "none"}} lang="en">
    <body style={{overscrollBehaviorY: "none"}}>
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}
