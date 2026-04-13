import { Boxes, CirclePercent, PackageSearch, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import { getDashboardMetrics } from "@/server/queries/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Visão geral da operação"
        description="Resumo rápido para o vendedor conferir estoque, promoções e os produtos consultados mais recentemente."
        actions={
          <Link href="/products" className={buttonVariants({ variant: "primary" })}>
            Ir para produtos
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Produtos cadastrados"
          value={formatNumber(metrics.totalProducts)}
          description={`${formatNumber(metrics.activeProducts)} ativos para venda imediata.`}
          icon={<Boxes className="size-5" />}
        />
        <StatCard
          title="Itens em promoção"
          value={formatNumber(metrics.promotionalProducts)}
          description="Produtos com preço promocional visível no atendimento."
          icon={<CirclePercent className="size-5" />}
          tone="accent"
        />
        <StatCard
          title="Estoque total"
          value={formatNumber(metrics.totalUnits)}
          description="Soma de todas as unidades distribuídas por numeração."
          icon={<PackageSearch className="size-5" />}
          tone="success"
        />
        <StatCard
          title="Baixo estoque"
          value={formatNumber(metrics.lowStockProducts)}
          description="Produtos com poucas unidades restantes e risco de ruptura."
          icon={<TriangleAlert className="size-5" />}
          tone="warning"
        />
      </div>

      <section className="surface-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Últimas atualizações
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              Produtos recentes
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Acesse rapidamente os produtos cadastrados ou alterados mais
              recentemente.
            </p>
          </div>
          <Link href="/products" className={buttonVariants({ variant: "outline" })}>
            Ver catálogo completo
          </Link>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {metrics.recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="surface-subtle flex flex-col gap-4 p-5 transition hover:bg-white"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{product.brand.name}</Badge>
                <Badge variant="outline">{product.category.name}</Badge>
                {product.promotionalPrice ? (
                  <Badge variant="warning">Promoção</Badge>
                ) : null}
              </div>

              <h3 className="font-display text-xl font-semibold text-slate-900">
                {product.model}
              </h3>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Preço
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatCurrencyBRL(
                      product.promotionalPrice ?? product.currentPrice,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Cor
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">{product.color}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Estoque
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatNumber(product.totalStock)} unidades
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
