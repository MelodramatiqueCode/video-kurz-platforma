import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function ThumbnailSkeleton({ size = "md" }: { size?: "xs" | "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "lg"
      ? "h-36 w-full"
      : size === "sm"
        ? "h-12 w-20"
        : size === "xs"
          ? "h-10 w-16"
          : "h-16 w-28";

  return <Skeleton className={sizeClass} />;
}
