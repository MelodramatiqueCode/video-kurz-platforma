"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.message, error.digest);
  }, [error]);

  function handleRetry() {
    reset();

    window.setTimeout(() => {
      if (document.body.innerText.includes("Niečo sa pokazilo")) {
        window.location.reload();
      }
    }, 100);
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Niečo sa pokazilo</h1>
      <p className="text-muted-foreground">
        Skúste stránku obnoviť. Ak problém pretrváva, kontaktujte podporu.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => window.location.reload()}>
          Obnoviť stránku
        </Button>
        <Button type="button" variant="outline" onClick={handleRetry}>
          Skúsiť znova
        </Button>
      </div>
    </div>
  );
}
