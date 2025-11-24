import type { Metadata } from "next";
import { Playfair_Display, Lato, Great_Vibes, Poppins, Lora, Cinzel, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout";
import Footer from "../components/layout/Footer";
import ClientProviders from "../components/providers/ClientProviders";
import CookieConsent from "../components/common/CookieConsent";
import { Toaster } from "react-hot-toast";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Helps build absolute URLs for social images
  metadataBase: new URL("https://izaj-lighting-centre.netlify.app"),
  title: {
    default: "IZAJ Lighting Centre",
    template: "%s | IZAJ Lighting Centre",
  },
  description: "Premium lighting solutions for every space.",
  icons: {
    icon:[ { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "IZAJ Lighting Centre",
    title: "IZAJ Lighting Centre",
    description: "Premium lighting solutions for every space.",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "IZAJ Lighting Centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IZAJ Lighting Centre",
    description: "Premium lighting solutions for every space.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${lato.variable} ${greatVibes.variable} ${poppins.variable} ${lora.variable} ${cinzel.variable} ${jost.variable} antialiased bg-white`}
      >
        <ClientProviders>
          <Header />
          {children}
          <Footer />
          <CookieConsent forceShow={false} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1f2937',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                fontFamily: 'Jost, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
