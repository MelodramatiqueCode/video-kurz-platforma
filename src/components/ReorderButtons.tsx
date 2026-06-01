"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReorderButtons({
  entity,
  id,
}: {
  entity: "day" | "lesson";
  id: string;
}) {
  const router = useRouter();

  async function move(direction: "up" | "down") {
    await fetch("/api/admin/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, id, direction }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" size="sm" onClick={() => move("up")} aria-label="Posunúť hore">
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => move("down")} aria-label="Posunúť dole">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
