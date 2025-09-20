import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Pokédex App - Discover and Organize Pokémon",
  description: "A comprehensive Pokémon app to browse, favorite, and organize your favorite Pokémon into custom groups. Built with Next.js and the PokéAPI.",
  keywords: "pokemon, pokedex, favorite, groups, stats, collection",
  authors: [{ name: "Pokédex App" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <Navigation />
        <main className="pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
