"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminProgramSettings({
  program,
}: {
  program: {
    id: string;
    title: string;
    description: string | null;
    priceCents: number;
    stripePriceId: string | null;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(program.title);
  const [description, setDescription] = useState(program.description ?? "");
  const [priceCents, setPriceCents] = useState(String(program.priceCents));
  const [stripePriceId, setStripePriceId] = useState(program.stripePriceId ?? "");
  const [published, setPublished] = useState(program.published);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    await fetch("/api/admin/program", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: program.id,
        title,
        description,
        priceCents: Number(priceCents),
        stripePriceId: stripePriceId || null,
        published,
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-6">
      <h2 className="text-lg font-semibold">Nastavenia programu</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="program-title">Názov</Label>
          <Input id="program-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="program-price">Cena v centoch</Label>
          <Input
            id="program-price"
            type="number"
            value={priceCents}
            onChange={(event) => setPriceCents(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="program-description">Popis</Label>
        <Input
          id="program-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stripe-price-id">Stripe Price ID</Label>
        <Input
          id="stripe-price-id"
          value={stripePriceId}
          onChange={(event) => setStripePriceId(event.target.value)}
          placeholder="price_..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        Publikované
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Ukladám..." : "Uložiť program"}
      </Button>
    </form>
  );
}
