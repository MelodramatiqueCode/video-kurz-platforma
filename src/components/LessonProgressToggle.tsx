"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function LessonProgressToggle({
  lessonId,
  initialCompleted,
}: {
  lessonId: string;
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle(checked: boolean) {
    setLoading(true);
    setCompleted(checked);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: checked }),
      });

      if (!response.ok) {
        throw new Error("Progress update failed");
      }

      router.refresh();
    } catch {
      setCompleted(!checked);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
      <Checkbox
        id={`lesson-${lessonId}`}
        checked={completed}
        disabled={loading}
        onCheckedChange={(value) => toggle(value === true)}
      />
      <Label htmlFor={`lesson-${lessonId}`} className="cursor-pointer">
        {completed ? "Dokončené" : "Označiť ako hotové"}
      </Label>
    </div>
  );
}
