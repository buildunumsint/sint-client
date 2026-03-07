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

const OG_SITE_NAME = "";
const OG_TITLE = "";
const OG_DESCRIPTION =
  "";
const OG_URL = "";
const META_KEYWORDS = [   ""
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
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  keywords: META_KEYWORDS,
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
  const runtimeEnv = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__NEXT_PUBLIC_ENV__=${JSON.stringify(runtimeEnv)}`,
          }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
