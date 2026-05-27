"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminDayForm({
  programId,
  nextOrder,
}: {
  programId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(`Deň ${nextOrder}`);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId, title, description, order: nextOrder }),
    });

    setLoading(false);

    if (response.ok) {
      router.refresh();
      setTitle(`Deň ${nextOrder + 1}`);
      setDescription("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-4">
      <h3 className="font-semibold">Pridať deň</h3>
      <div className="space-y-2">
        <Label htmlFor="day-title">Názov</Label>
        <Input id="day-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="day-description">Popis</Label>
        <Input
          id="day-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Ukladám..." : "Pridať deň"}
      </Button>
    </form>
  );
}
