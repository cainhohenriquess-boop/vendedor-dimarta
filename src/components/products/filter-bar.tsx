import { ProductStatus } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ProductFilterOptions, ProductListFilters } from "@/types/product";

type FilterBarProps = {
  filters: ProductListFilters;
  options: ProductFilterOptions;
  total: number;
};

export function FilterBar({ filters, options, total }: FilterBarProps) {
  const hasFilters =
    Boolean(filters.query) ||
    Boolean(filters.audience) ||
    Boolean(filters.categoryId) ||
    Boolean(filters.brandId) ||
    Boolean(filters.color) ||
    Boolean(filters.size) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice) ||
    filters.promotion ||
    filters.inStock ||
    filters.status !== "ALL";

  return (
    <form className="surface-card space-y-5 p-5" method="get">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="q">
            Busca rápida
          </label>
          <Input
            id="q"
            name="q"
            defaultValue={filters.query}
            placeholder="Ex.: rasteira dourada, moleca branca, klin 28"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:pt-7">
          <button className={buttonVariants({ variant: "primary" })} type="submit">
            Buscar
          </button>
          {hasFilters ? (
            <Link
              href="/products"
              className={buttonVariants({ variant: "outline" })}
            >
              Limpar filtros
            </Link>
          ) : null}
          <Link
            href="/products/new"
            className={buttonVariants({ variant: "secondary" })}
          >
            Novo produto
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="audience">
            Público
          </label>
          <Select id="audience" name="audience" defaultValue={filters.audience ?? ""}>
            <option value="">Todos</option>
            <option value="ADULTO">Adulto</option>
            <option value="CRIANCA">Criança</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="categoryId">
            Categoria
          </label>
          <Select
            id="categoryId"
            name="categoryId"
            defaultValue={filters.categoryId ?? ""}
          >
            <option value="">Todas</option>
            {options.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="brandId">
            Marca
          </label>
          <Select id="brandId" name="brandId" defaultValue={filters.brandId ?? ""}>
            <option value="">Todas</option>
            {options.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="status">
            Status
          </label>
          <Select id="status" name="status" defaultValue={filters.status}>
            <option value="ALL">Todos</option>
            <option value={ProductStatus.ACTIVE}>Ativo</option>
            <option value={ProductStatus.INACTIVE}>Inativo</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="color">
            Cor
          </label>
          <Input
            id="color"
            name="color"
            list="product-colors"
            defaultValue={filters.color ?? ""}
            placeholder="Ex.: preto"
          />
          <datalist id="product-colors">
            {options.colors.map((color) => (
              <option key={color} value={color} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="size">
            Numeração
          </label>
          <Input
            id="size"
            name="size"
            type="number"
            min={15}
            max={50}
            defaultValue={filters.size ?? ""}
            placeholder="Ex.: 28"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="minPrice">
            Faixa de preço
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              step="0.01"
              min={0}
              defaultValue={filters.minPrice ?? ""}
              placeholder="Min."
            />
            <Input
              name="maxPrice"
              type="number"
              step="0.01"
              min={0}
              defaultValue={filters.maxPrice ?? ""}
              placeholder="Max."
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              name="promotion"
              type="checkbox"
              value="true"
              defaultChecked={filters.promotion}
            />
            Apenas promoção
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              name="inStock"
              type="checkbox"
              value="true"
              defaultChecked={filters.inStock}
            />
            Apenas com estoque
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-500">
          {total} produto(s) encontrado(s) para consulta rápida.
        </p>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Busca e filtros funcionam juntos
        </p>
      </div>
    </form>
  );
}
