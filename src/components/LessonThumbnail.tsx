import { cn } from "@/lib/utils";

export function LessonThumbnail({
  src,
  title,
  size = "md",
}: {
  src: string | null;
  title: string;
  size?: "xs" | "sm" | "md" | "lg";
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
      className={cn("shrink-0 rounded-md border border-zinc-200 object-cover", sizeClass)}
      loading="lazy"
    />
  );
}
