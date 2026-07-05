import React from "react";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

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

export const metadata = {
  title: "Admin Panel | Yogabhyasi",
  description: "Yogabhyasi Wellness Sanctuary Administrative Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

interface AdminRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ adminPath: string }>;
}

export default async function AdminRootLayout({ children, params }: AdminRootLayoutProps) {
  const { adminPath } = await params;
  const expectedAdminPath = process.env.ADMIN_ROUTE_PATH || "dashboard-x7k92m-admin";

  // Check if the current URL matches the expected secret admin route
  if (adminPath !== expectedAdminPath) {
    notFound();
  }

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-sand-50 text-sage-950">
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
