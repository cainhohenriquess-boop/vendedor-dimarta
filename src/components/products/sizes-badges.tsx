import { Badge } from "@/components/ui/badge";
import type { ProductSizeItem } from "@/types/product";

type SizesBadgesProps = {
  sizes: ProductSizeItem[];
};

export function SizesBadges({ sizes }: SizesBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Badge
          key={`${size.size}-${size.id ?? "new"}`}
          variant={size.stock > 0 ? "outline" : "muted"}
          className="gap-1"
        >
          <span>{size.size}</span>
          <span className="text-[10px] opacity-70">estoque {size.stock}</span>
        </Badge>
      ))}
    </div>
  );
}
