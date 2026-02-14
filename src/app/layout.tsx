import type {Metadata} from "next";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/700.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/crimson-text/400.css";
import "@fontsource/crimson-text/400-italic.css";
import "@fontsource/crimson-text/700.css";
import "@fontsource/crimson-text/700-italic.css";
import "@fontsource/dancing-script/400.css";
import "@fontsource/dancing-script/700.css";
import "../styles/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {ReactNode} from "react";
import {Providers} from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "Scavenger Hunt",
  description: "Scavenger Hunt App",
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
