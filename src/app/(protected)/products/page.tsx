import { FilterBar } from "@/components/products/filter-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { PageHeader } from "@/components/layout/page-header";
import {
  getProductFilterOptions,
  getProducts,
  parseProductListFilters,
} from "@/server/queries/products";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const filters = parseProductListFilters(await searchParams);
  const [products, options] = await Promise.all([
    getProducts(filters),
    getProductFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Consulta rápida de produtos"
        description="Pesquise por marca, modelo, categoria, cor ou numeração. Use os filtros combinados para encontrar o item certo durante o atendimento."
      />

      <FilterBar filters={filters} options={options} total={products.length} />

      <ProductGrid products={products} />
    </div>
  );
}
