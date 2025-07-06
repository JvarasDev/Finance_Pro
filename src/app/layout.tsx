import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Finance Pro | Tu Plataforma Financiera Premium",
  description: "Gestiona tus finanzas con inteligencia y estilo. Visualización avanzada, educación financiera y recomendaciones personalizadas.",
  keywords: "finanzas personales, gestión financiera, ahorro, inversiones, educación financiera",
  authors: [{ name: "Finance Pro Team" }],
  themeColor: "#b5a642",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  robots: "index, follow",
  openGraph: {
    title: "Finance Pro | Tu Plataforma Financiera Premium",
    description: "Gestiona tus finanzas con inteligencia y estilo. Visualización avanzada, educación financiera y recomendaciones personalizadas.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Pro | Tu Plataforma Financiera Premium",
    description: "Gestiona tus finanzas con inteligencia y estilo.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-light via-light to-gold/5 dark:from-dark dark:via-dark dark:to-gold/10 min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
