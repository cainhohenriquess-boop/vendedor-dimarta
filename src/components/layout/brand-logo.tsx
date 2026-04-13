import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-[30px] border border-[#8f6d52]/20 shadow-[0_24px_60px_-32px_rgba(89,61,39,0.45)]",
          imageClassName,
        )}
      >
        <Image
          src="/branding/dimarta-logo.svg"
          alt={APP_NAME}
          width={629}
          height={629}
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
