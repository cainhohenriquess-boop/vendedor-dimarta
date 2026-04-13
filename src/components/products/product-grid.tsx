import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { ProductListItem } from "@/types/product";

type ProductGridProps = {
  products: ProductListItem[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Ajuste os filtros, refine a busca ou cadastre um novo produto para aparecer na listagem."
        action={
          <Link href="/products/new" className={buttonVariants({ variant: "primary" })}>
            Cadastrar produto
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
