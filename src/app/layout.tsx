import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {headers} from "next/headers";
import {Container} from "react-bootstrap";
import {ReactNode} from "react";

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
  if (!/android.+mobile|ip(hone|[oa]d)/i.test((await headers()).get('user-agent') || '')) {
    return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Container className="pt-2">
        <p>This application is not compatible for desktop navigation.</p>
        <p>Please open it on mobile.</p>
      </Container>
      </body>
      </html>
    );
  }

  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    {children}
    </body>
    </html>
  );
}
