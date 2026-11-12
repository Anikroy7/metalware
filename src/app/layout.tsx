import type { Metadata } from "next";
import { Anton, Cormorant_Garamond, Geist, Montserrat } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import { Providers } from "@/components/providers";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Metalware — Music & Lifestyle",
    template: "%s · Metalware",
  },
  description:
    "Band tees, hoodies and music-inspired streetwear. Cash on Delivery all over Bangladesh.",
  openGraph: {
    siteName: "Metalware",
    images: [{ url: "/metalware-logo.png", width: 2000, height: 2000, alt: "Metalware — Music & Lifestyle" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${anton.variable} ${cormorant.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MusicPlayer />
        </Providers>
      </body>
    </html>
  );
}
