import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MuxAssetStatus } from "@/lib/mux";

const labels: Record<MuxAssetStatus, string> = {
  ready: "Video pripravené",
  preparing: "Spracováva sa",
  errored: "Chyba videa",
  missing: "Video chýba",
};

export function MuxVideoStatusBadge({ status }: { status: MuxAssetStatus }) {
  return (
    <Badge
      className={cn(
        status === "ready" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        status === "preparing" && "border-sky-200 bg-sky-50 text-sky-900",
        status === "errored" && "border-red-200 bg-red-50 text-red-800",
        status === "missing" && "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      {labels[status]}
    </Badge>
  );
}
