import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/components/products/product-form";
import { defaultProductValues } from "@/lib/validations/product";
import { isBlobUploadConfigured } from "@/lib/uploads";
import { getProductFilterOptions } from "@/server/queries/products";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const options = await getProductFilterOptions();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cadastro"
        title="Novo produto"
        description="Cadastre o produto com todos os campos estruturados para facilitar a consulta rápida no balcão."
      />

      <ProductForm
        mode="create"
        defaultValues={defaultProductValues}
        categories={options.categories}
        brands={options.brands}
        uploadEnabled={isBlobUploadConfigured()}
      />
    </div>
  );
}
