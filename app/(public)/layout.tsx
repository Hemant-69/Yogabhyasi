import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/ui/Header";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { SITE_METADATA } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: SITE_METADATA.keywords,
  metadataBase: new URL(SITE_METADATA.url),
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: "Yogabhyasi Wellness",
    images: [
      {
        url: SITE_METADATA.ogImage,
        width: 1200,
        height: 630,
        alt: "Yogabhyasi Wellness Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.ogImage],
  },
  icons: {
    icon: "/logo/dark-logo-icon.png",
    apple: "/logo/dark-logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        {/* Theme-aware favicon: dark icon on light mode, light icon on dark mode */}
        <link rel="icon" href="/logo/dark-logo-icon.png" type="image/png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/logo/light-logo-icon.png" type="image/png" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-sand-100 text-sage-950">
        <Header />
        <main className="flex-grow">{children}</main>
        <FloatingCTA />
      </body>
    </html>
  );
}
