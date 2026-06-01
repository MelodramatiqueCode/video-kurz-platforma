"use client";

import { useEffect } from "react";

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

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Niečo sa pokazilo</h1>
      <p className="text-muted-foreground">Skúste stránku obnoviť. Ak problém pretrváva, kontaktujte podporu.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Skúsiť znova
      </button>
    </div>
  );
}
