import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/components/products/product-form";
import { isBlobUploadConfigured } from "@/lib/uploads";
import {
  getProductFilterOptions,
  getProductForEdit,
} from "@/server/queries/products";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const [product, options] = await Promise.all([
    getProductForEdit(id),
    getProductFilterOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edicao"
        title={`Editar ${product.model}`}
        description="Atualize preco, estoque, status, foto e demais campos estruturados do produto."
      />

      <ProductForm
        mode="edit"
        productId={id}
        defaultValues={product}
        categories={options.categories}
        brands={options.brands}
        uploadEnabled={isBlobUploadConfigured()}
      />
    </div>
  );
}
