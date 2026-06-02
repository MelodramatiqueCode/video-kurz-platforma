"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export function BuyButton({
  programSlug,
  className,
}: {
  programSlug: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programSlug }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.href = "/prihlasenie?next=/";
        return;
      }
      setError(data.error ?? "Checkout zlyhal");
      return;
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button size="lg" className="w-full sm:w-auto" onClick={handleBuy} disabled={loading}>
        {loading ? "Presmerovávam..." : "Kúpiť prístup"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
