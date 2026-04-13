import { ArrowLeft, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteProductButton } from "@/components/products/delete-product-button";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { SizesBadges } from "@/components/products/sizes-badges";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyBRL, formatDateTime, formatNumber } from "@/lib/utils";
import { getProductById } from "@/server/queries/products";

export const dynamic = "force-dynamic";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalhes"
        title={product.model}
        description="Leitura rápida das informações essenciais para atendimento: preço, estoque, numerações, cor e status."
        actions={
          <>
            <Link href="/products" className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
            <Link
              href={`/products/${product.id}/edit`}
              className={buttonVariants({ variant: "primary" })}
            >
              <PencilLine className="size-4" />
              Editar
            </Link>
            <DeleteProductButton
              productId={product.id}
              productName={product.model}
              redirectTo="/products"
              variant="danger"
              size="md"
              label="Excluir"
            />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <section className="surface-card space-y-5 p-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src={product.imageUrl}
              alt={product.model}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 720px"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{product.brand.name}</Badge>
            <Badge variant="outline">{product.category.name}</Badge>
            <Badge variant="outline">
              {product.audience === "ADULTO" ? "Adulto" : "Criança"}
            </Badge>
            <ProductStatusBadge status={product.status} />
            {product.promotionalPrice ? <Badge variant="warning">Promoção</Badge> : null}
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {product.model}
            </h2>
          </div>
        </section>

        <section className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Preço em destaque
            </p>
            {product.promotionalPrice ? (
              <>
                <p className="mt-3 text-base text-slate-400 line-through">
                  {formatCurrencyBRL(product.currentPrice)}
                </p>
                <p className="font-display text-5xl font-semibold text-amber-600">
                  {formatCurrencyBRL(product.promotionalPrice)}
                </p>
              </>
            ) : (
              <p className="mt-3 font-display text-5xl font-semibold text-slate-900">
                {formatCurrencyBRL(product.currentPrice)}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Cor
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">{product.color}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Estoque total
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatNumber(product.totalStock)} unidades
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Atualizado em
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatDateTime(product.updatedAt)}
              </p>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Variações
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Numerações e estoque por tamanho
              </h3>
            </div>
            <div className="mt-4">
              <SizesBadges sizes={product.sizes} />
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Criado por
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {product.createdByName ?? "Sistema"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Última alteração
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {product.updatedByName ?? "Sistema"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
