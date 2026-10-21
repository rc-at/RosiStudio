import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#C9A34E",
};

export const metadata: Metadata = {
  title: "ROSI STUDIO — Expertos en Belleza | Barbería, Peluquería y Estética",
  description:
    "Reserva tu cita en ROSI STUDIO. Servicios profesionales de barbería, peluquería, trenzas, manicure, pedicure, tintes y cuidado personal en local o a domicilio.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ROSI STUDIO",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "Rosi Studio",
    "barbería",
    "peluquería",
    "trenzas",
    "manicure",
    "pedicure",
    "tintes",
    "reservas de belleza",
    "Perú",
  ],
  authors: [{ name: "ROSI STUDIO" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F6F2] text-[#171717] font-sans antialiased selection:bg-[#C9A34E]/20 selection:text-[#171717]">
        {children}
      </body>
    </html>
  );
}
