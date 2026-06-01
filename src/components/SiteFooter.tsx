import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo imageClassName="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mamy mimo davu
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href="/program" className="transition-colors hover:text-foreground">
            Program
          </Link>
          <Link href="/prihlasenie" className="transition-colors hover:text-foreground">
            Prihlásenie
          </Link>
          <Link href="/profil" className="transition-colors hover:text-foreground">
            Účet
          </Link>
        </nav>
      </div>
    </footer>
  );
}
