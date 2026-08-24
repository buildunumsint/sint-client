import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const OG_IMAGE_DEFAULT = "https://unumsint.com/Diocese_Logo.png";

const OG_SITE_NAME = "Unum Sint";
const OG_TITLE =
  "Unum Sint — Digital platform for the Catholic Diocese of Port Harcourt";
const OG_DESCRIPTION =
  "Unum Sint is the official digital platform of the Catholic Diocese of Port Harcourt. It connects parishes in one place: a secure sacramental records archive for parish and diocesan staff, diocesan-approved catechesis, parish announcements and community, and an AI faith companion. Available on the web and as a mobile app.";
export const OG_URL = "https://unumsint.com";
const META_KEYWORDS = [
  "Unum Sint",
  "Catholic Diocese of Port Harcourt",
  "parish management",
  "sacramental records",
  "catechesis",
  "Catholic app",
];

const OG_IMAGES_DEFAULT = [
  {
    url: OG_IMAGE_DEFAULT,
    width: 1200,
    height: 630,
    alt: OG_SITE_NAME,
  },
  {
    url: OG_IMAGE_DEFAULT,
    width: 600,
    height: 315,
    alt: OG_SITE_NAME,
  },
  {
    url: OG_IMAGE_DEFAULT,
    width: 2400,
    height: 1260,
    alt: OG_SITE_NAME,
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(OG_URL),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  keywords: META_KEYWORDS,
  applicationName: OG_SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: OG_IMAGES_DEFAULT,
    url: OG_URL,
    type: "website",
    siteName: OG_SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: OG_IMAGES_DEFAULT,
    site: OG_SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
