import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function VideoStatusBadge({ ready }: { ready: boolean }) {
  return (
    <Badge
      className={cn(
        ready
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      {ready ? "Video nahraté" : "Video chýba"}
    </Badge>
  );
}

export function VideoCountBadge({
  ready,
  total,
}: {
  ready: number;
  total: number;
}) {
  if (total === 0) {
    return <Badge>Žiadne lekcie</Badge>;
  }

  const allReady = ready === total;
  const noneReady = ready === 0;

  return (
    <Badge
      className={cn(
        allReady && "border-emerald-200 bg-emerald-50 text-emerald-800",
        noneReady && "border-amber-200 bg-amber-50 text-amber-900",
        !allReady && !noneReady && "border-sky-200 bg-sky-50 text-sky-900",
      )}
    >
      {ready}/{total} videí nahratých
    </Badge>
  );
}
