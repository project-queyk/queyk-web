import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Queyk",
    default: "Queyk",
  },
  description: "An open-source earthquake early warning system.",
  metadataBase: new URL("https://www.queyk.com"),
  openGraph: {
    type: "website",
    url: "https://www.queyk.com",
    title: "Queyk - An open-source earthquake early warning system.",
    description:
      "Earthquake monitoring and early warning system. Get alerts, track seismic activity, and stay prepared with our open-source platform.",
    siteName: "Queyk",
    images: [
      {
        url: "https://www.queyk.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
