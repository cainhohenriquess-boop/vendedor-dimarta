import type { Metadata } from "next";
import { Archivo, Manrope } from "next/font/google";
import { APP_NAME } from "@/lib/constants";
import { Providers } from "@/components/providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Sistema interno para vendedores de loja de calcados consultarem preco, estoque e detalhes dos produtos com rapidez.",
  applicationName: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${archivo.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
