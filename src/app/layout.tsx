import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Premium | Gerador de QR Code Profissional - Pix, WhatsApp e Wi-Fi",
  description: "Crie QR Codes profissionais em alta resolução para Pix, WhatsApp, redes sociais e muito mais. Teste grátis por 10 dias com gestão completa no dashboard.",
  keywords: ["gerador de qr code", "qr code pix", "qr code whatsapp", "gerar qr code profissional", "qr premium"],
  authors: [{ name: "QR Premium" }],
  openGraph: {
    title: "QR Premium | Gerador de QR Code Profissional",
    description: "Crie QR Codes profissionais para o seu negócio em segundos.",
    url: "https://geradorqrpremium.vercel.app",
    siteName: "QR Premium",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
