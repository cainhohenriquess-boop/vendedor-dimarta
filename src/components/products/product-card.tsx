import { Package2, PencilLine, ScanSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/products/delete-product-button";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { SizesBadges } from "@/components/products/sizes-badges";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyBRL, formatNumber, cn } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const isOnPromotion = typeof product.promotionalPrice === "number";

  return (
    <article
      className={cn(
        "surface-card overflow-hidden p-0",
        isOnPromotion && "ring-1 ring-amber-200",
      )}
    >
      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative min-h-56 bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.model}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 220px"
          />
          {isOnPromotion ? (
            <Badge className="absolute left-4 top-4 bg-amber-400 text-amber-950">
              Promoção
            </Badge>
          ) : null}
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{product.brand.name}</Badge>
                <Badge variant="outline">{product.category.name}</Badge>
                <ProductStatusBadge status={product.status} />
              </div>

              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {product.model}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {product.shortDescription}
                </p>
              </div>
            </div>

            <div className="surface-subtle min-w-44 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Preço
              </p>
              {isOnPromotion ? (
                <>
                  <p className="mt-2 text-sm text-slate-400 line-through">
                    {formatCurrencyBRL(product.currentPrice)}
                  </p>
                  <p className="font-display text-3xl font-semibold text-amber-600">
                    {formatCurrencyBRL(product.promotionalPrice ?? product.currentPrice)}
                  </p>
                </>
              ) : (
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">
                  {formatCurrencyBRL(product.currentPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Cor
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{product.color}</p>
            </div>
            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Código
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {product.internalCode}
              </p>
            </div>
            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Estoque total
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {formatNumber(product.totalStock)} unidades
              </p>
            </div>
            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Público
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {product.audience === "ADULTO" ? "Adulto" : "Criança"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Package2 className="size-4 text-primary" />
              Numerações e estoque
            </div>
            <SizesBadges sizes={product.sizes} />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap">
            <Link
              href={`/products/${product.id}`}
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              <ScanSearch className="size-4" />
              Ver detalhes
            </Link>
            <Link
              href={`/products/${product.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <PencilLine className="size-4" />
              Editar
            </Link>
            <DeleteProductButton
              productId={product.id}
              productName={product.model}
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
