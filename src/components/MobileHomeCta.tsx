"use client";

import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function MobileHomeCta({
  programSlug,
  priceCents,
  currency,
  isLoggedIn,
}: {
  programSlug: string;
  priceCents: number;
  currency: string;
  isLoggedIn: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold leading-none">{formatPrice(priceCents, currency)}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">Doživotný prístup</p>
        </div>
        <div className="shrink-0 [&_button]:w-auto">
          {isLoggedIn ? (
            <BuyButton programSlug={programSlug} />
          ) : (
            <Button asChild size="lg">
              <Link href="/prihlasenie">Prihlásiť sa</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
