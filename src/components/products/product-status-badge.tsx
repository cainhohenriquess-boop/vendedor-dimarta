import { ProductStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/constants";

type ProductStatusBadgeProps = {
  status: ProductStatus;
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <Badge variant={status === ProductStatus.ACTIVE ? "success" : "muted"}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
