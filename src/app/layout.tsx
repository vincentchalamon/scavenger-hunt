import type {Metadata} from "next";
import "../styles/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {ReactNode} from "react";
import {Providers} from "@/components/Providers/Providers";

// Use fallback fonts instead of loading from Google Fonts
// This allows the build to work in offline/restricted environments
const fontVariables = '--font-geist-sans --font-geist-mono --font-title --font-body --font-script';

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
