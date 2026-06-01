import { cn } from "@/lib/utils";

export function LessonThumbnail({
  src,
  title,
  size = "md",
  variant = "default",
}: {
  src: string | null;
  title: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "admin";
}) {
  if (!src) return null;

  const sizeClass =
    size === "lg"
      ? "h-36 w-full"
      : size === "sm"
        ? "h-12 w-20"
        : size === "xs"
          ? "h-10 w-16"
          : "h-16 w-28";

  return (
    <img
      src={src}
      alt={`Ukážka videa: ${title}`}
      className={cn("shrink-0 rounded-lg border border-border object-cover", sizeClass)}
      style={variant === "admin" ? { objectPosition: "center 35%" } : undefined}
      loading="lazy"
    />
  );
}
