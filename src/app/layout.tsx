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
  title: "QR Premium | Seus QR Codes em outro nível ✨",
  description: "Crie QR Codes profissionais e personalizados para seu negócio. Pix, WhatsApp e muito mais com design premium! 🚀",
  keywords: ["gerador de qr code", "qr code pix", "qr code whatsapp", "gerar qr code profissional", "qr premium"],
  authors: [{ name: "QR Premium" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "QR Premium | Seus QR Codes em outro nível ✨",
    description: "Crie QR Codes profissionais e personalizados para seu negócio. Pix, WhatsApp e muito mais com design premium! 🚀",
    url: "https://geradorqrpremium.vercel.app",
    siteName: "QR Premium",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Premium - Gerador de QR Code Profissional",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Premium | Seus QR Codes em outro nível ✨",
    description: "Crie QR Codes profissionais e personalizados para seu negócio.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "1c827f7e269a68c1",
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
