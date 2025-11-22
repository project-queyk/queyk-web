import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import Provider from "@/components/Provider";
import GoogleOneTap from "@/components/GoogleOneTap";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Queyk",
    template: "%s | Queyk",
  },
  description: "An open-source earthquake early warning system.",
  metadataBase: new URL("https://www.queyk.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Queyk",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Queyk",
    url: "https://www.queyk.com",
    title: "Queyk - An open-source earthquake early warning system.",
    description:
      "Earthquake monitoring and early warning system. Get alerts, track seismic activity, and stay prepared with our open-source platform.",
    images: [
      {
        url: "https://www.queyk.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: "Queyk",
      template: "%s | Queyk",
    },
    description:
      "Earthquake monitoring and early warning system. Get alerts, track seismic activity, and stay prepared with our open-source platform.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1f3f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        <Provider>
          {children}
          <GoogleOneTap />
        </Provider>
      </body>
    </html>
  );
}
