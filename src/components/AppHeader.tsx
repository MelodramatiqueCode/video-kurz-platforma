"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type DayNavItem = {
  id: string;
  title: string;
  slug: string;
  progress: number;
  thumbnailUrl?: string | null;
};

function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" size={compact ? "sm" : "sm"} onClick={handleSignOut} disabled={loading}>
      {loading ? "Odhlasujem..." : "Odhlásiť sa"}
    </Button>
  );
}

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 transition-colors",
        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function AppHeader({
  email,
  isAdmin = false,
}: {
  email?: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/program", label: "Program", active: pathname.startsWith("/program") },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", active: pathname.startsWith("/admin") }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandLogo priority />

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} active={link.active}>
              {link.label}
            </NavLink>
          ))}
          {email ? (
            <>
              <NavLink href="/profil" active={pathname.startsWith("/profil")}>
                Účet
              </NavLink>
              <span className="hidden max-w-[180px] truncate px-2 text-muted-foreground lg:inline">
                {email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/prihlasenie">Prihlásenie</Link>
            </Button>
          )}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Zavrieť menu" : "Otvoriť menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={link.active}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {email ? (
              <>
                <NavLink
                  href="/profil"
                  active={pathname.startsWith("/profil")}
                  onClick={() => setMobileOpen(false)}
                >
                  Účet
                </NavLink>
                <p className="px-3 py-2 text-xs text-muted-foreground">{email}</p>
                <div className="px-3 pt-1">
                  <SignOutButton compact />
                </div>
              </>
            ) : (
              <Button asChild className="mt-2 w-full">
                <Link href="/prihlasenie" onClick={() => setMobileOpen(false)}>
                  Prihlásenie
                </Link>
              </Button>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function DayNavLink({
  day,
  activeSlug,
  compact = false,
}: {
  day: DayNavItem;
  activeSlug?: string;
  compact?: boolean;
}) {
  const active = activeSlug === day.slug;

  return (
    <Link
      href={`/program/den/${day.slug}`}
      className={cn(
        "block shrink-0 rounded-xl border transition-all",
        compact ? "w-44 px-3 py-2.5" : "px-4 py-3",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
      )}
    >
      <div className="flex items-center gap-3">
        <LessonThumbnail src={day.thumbnailUrl ?? null} title={day.title} size="xs" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium">{day.title}</span>
            <span className={cn("shrink-0 text-xs", active ? "opacity-90" : "text-muted-foreground")}>
              {day.progress}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function DaySidebar({
  days,
  activeSlug,
}: {
  days: DayNavItem[];
  activeSlug?: string;
}) {
  return (
    <>
      <aside className="hidden space-y-3 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dni programu</p>
        <div className="space-y-2">
          {days.map((day) => (
            <DayNavLink key={day.id} day={day} activeSlug={activeSlug} />
          ))}
        </div>
      </aside>

      <div className="space-y-2 lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dni programu</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {days.map((day) => (
            <DayNavLink key={day.id} day={day} activeSlug={activeSlug} compact />
          ))}
        </div>
      </div>
    </>
  );
}
