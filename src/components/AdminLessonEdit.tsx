"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLessonEdit({
  lesson,
}: {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    order: number;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [order, setOrder] = useState(String(lesson.order));
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: lesson.id,
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

    setMessage("Lekcia bola uložená.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor={`lesson-title-${lesson.id}`}>Názov lekcie</Label>
          <Input
            id={`lesson-title-${lesson.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`lesson-order-${lesson.id}`}>Poradie</Label>
          <Input
            id={`lesson-order-${lesson.id}`}
            type="number"
            min={1}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`lesson-description-${lesson.id}`}>Popis</Label>
        <Input
          id={`lesson-description-${lesson.id}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Ukladám..." : "Uložiť lekciu"}
        </Button>
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </div>
    </form>
  );
}
