import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
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

export const metadata: Metadata = {
  title: "Scavenger Hunt",
  description: "Scavenger Hunt App",
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
  return (
    <html style={{overscrollBehaviorY: "none"}} lang="en">
    <body style={{overscrollBehaviorY: "none"}} className={`${geistSans.variable} ${geistMono.variable}`}>
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}
