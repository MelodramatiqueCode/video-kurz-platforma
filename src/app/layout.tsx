import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video kurz platforma",
  description: "Denný video program s pracovnými zošitmi a sledovaním postupu.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="sk">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
        <AppHeader email={user?.email} />
        <main>{children}</main>
      </body>
    </html>
  );
}
