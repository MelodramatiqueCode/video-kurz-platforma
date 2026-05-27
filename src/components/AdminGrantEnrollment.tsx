"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminGrantEnrollment({ programId }: { programId: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/enrollment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId, email }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? "Nepodarilo sa udeliť prístup");
      return;
    }

    setMessage("Prístup bol udelený.");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-4">
      <h3 className="font-semibold">Manuálne udeliť prístup (test)</h3>
      <div className="space-y-2">
        <Label htmlFor="grant-email">Email používateľa</Label>
        <Input id="grant-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Ukladám..." : "Udeliť prístup"}
      </Button>
      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </form>
  );
}
