import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isAdminEmail } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mamy mimo davu · Video program",
  description: "Online video program s lekciami, pracovnými zošitmi a sledovaním postupu.",
  icons: {
    icon: "/logo-mamy-mimo-davu.png",
    apple: "/logo-mamy-mimo-davu.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = isAdminEmail(user?.email);

  return (
    <html lang="sk" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <AppHeader email={user?.email} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
