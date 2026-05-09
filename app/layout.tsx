import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheraFlow AI",
  description: "Copilote IA pour thérapeutes indépendants"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
