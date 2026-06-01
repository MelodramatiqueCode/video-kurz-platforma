"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminDayEdit({
  day,
  lessonCount,
  showManageLink = true,
}: {
  day: {
    id: string;
    title: string;
    description: string | null;
    order: number;
  };
  lessonCount: number;
  showManageLink?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(day.title);
  const [description, setDescription] = useState(day.description ?? "");
  const [order, setOrder] = useState(String(day.order));
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/days", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayId: day.id,
        title,
        description,
        order: Number(order),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Uloženie zlyhalo");
      return;
    }

    setMessage("Deň bol uložený.");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Naozaj chcete zmazať deň „${title}“? Vymaže sa aj ${lessonCount} lekcií s videami a prílohami.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    const response = await fetch("/api/admin/days", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayId: day.id }),
    });

    setDeleting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Zmazanie zlyhalo");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor={`day-title-${day.id}`}>Názov dňa</Label>
          <Input
            id={`day-title-${day.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`day-order-${day.id}`}>Poradie</Label>
          <Input
            id={`day-order-${day.id}`}
            type="number"
            min={1}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`day-description-${day.id}`}>Popis</Label>
        <Input
          id={`day-description-${day.id}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading || deleting}>
          {loading ? "Ukladám..." : "Uložiť deň"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={loading || deleting}
          onClick={handleDelete}
        >
          {deleting ? "Mažem..." : "Zmazať deň"}
        </Button>
        {showManageLink ? (
          <Link href={`/admin/den/${day.id}`} className="text-sm font-medium underline">
            Spravovať lekcie
          </Link>
        ) : null}
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </div>
    </form>
  );
}
