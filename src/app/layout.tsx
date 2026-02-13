import type {Metadata} from "next";
import {Geist, Geist_Mono, Cinzel, Crimson_Text, Dancing_Script} from "next/font/google";
import "../styles/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {ReactNode} from "react";
import {Providers} from "@/components/Providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Thematic fonts for "Route"
const cinzel = Cinzel({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const crimsonText = Crimson_Text({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Scavenger Hunt",
  description: "Scavenger Hunt App",
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
  return (
    <html style={{overscrollBehaviorY: "none"}} lang="en">
    <body style={{overscrollBehaviorY: "none"}} className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${crimsonText.variable} ${dancingScript.variable}`}>
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}
