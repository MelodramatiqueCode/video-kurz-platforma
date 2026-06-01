import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
}: {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo-mamy-mimo-davu.png"
        alt="Mamy mimo davu"
        width={120}
        height={120}
        priority={priority}
        className={cn("h-10 w-10 object-contain sm:h-12 sm:w-12", imageClassName)}
      />
    </Link>
  );
}

export function BrandLogoLarge({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex", className)}>
      <Image
        src="/logo-mamy-mimo-davu.png"
        alt="Mamy mimo davu"
        width={220}
        height={220}
        priority
        className="h-28 w-28 object-contain sm:h-36 sm:w-36"
      />
    </div>
  );
}
