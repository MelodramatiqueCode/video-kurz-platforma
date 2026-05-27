"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type DayNavItem = {
  id: string;
  title: string;
  slug: string;
  progress: number;
};

export function AppHeader({
  email,
  isAdmin,
}: {
  email?: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Video kurz
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/program"
            className={cn(pathname.startsWith("/program") ? "font-semibold" : "text-zinc-600")}
          >
            Program
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(pathname.startsWith("/admin") ? "font-semibold" : "text-zinc-600")}
            >
              Admin
            </Link>
          ) : null}
          {email ? (
            <span className="hidden text-zinc-500 sm:inline">{email}</span>
          ) : (
            <Link href="/prihlasenie" className="text-zinc-600">
              Prihlásenie
            </Link>
          )}
        </nav>
      </div>
    </header>
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
    <aside className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Dni programu</p>
      <div className="space-y-2">
        {days.map((day) => (
          <Link
            key={day.id}
            href={`/program/den/${day.slug}`}
            className={cn(
              "block rounded-lg border px-4 py-3 transition-colors",
              activeSlug === day.slug
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:border-zinc-300",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{day.title}</span>
              <span className="text-xs opacity-80">{day.progress}%</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
