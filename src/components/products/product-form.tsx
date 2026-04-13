"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Plus, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import type { ProductFormDefaults, SelectOption } from "@/types/product";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  defaultValues: ProductFormDefaults;
  categories: SelectOption[];
  brands: SelectOption[];
  uploadEnabled: boolean;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-500">{message}</p>;
}

async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "Falha ao enviar a imagem.");
  }

  const payload = (await response.json()) as { url: string };
  return payload.url;
}

export function ProductForm({
  mode,
  productId,
  defaultValues,
  categories,
  brands,
  uploadEnabled,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(defaultValues.imageUrl);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreviewUrl(imageUrl || DEFAULT_PRODUCT_IMAGE);
  }, [imageUrl, selectedFile]);

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          try {
            let finalImageUrl = values.imageUrl?.trim();

            if (selectedFile) {
              finalImageUrl = await uploadProductImage(selectedFile);
            }

            if (!finalImageUrl) {
              throw new Error("Adicione uma imagem ou informe uma URL valida.");
            }

            const response = await fetch(
              mode === "create" ? "/api/products" : `/api/products/${productId}`,
              {
                method: mode === "create" ? "POST" : "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...values,
                  imageUrl: finalImageUrl,
                  sizes: values.sizes.map((size: ProductFormValues["sizes"][number]) => ({
                    size: Number(size.size),
                    stock: Number(size.stock),
                  })),
                }),
              },
            );

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as
                | { error?: string }
                | null;
              throw new Error(payload?.error ?? "Nao foi possivel salvar o produto.");
            }

            const payload = (await response.json()) as { id: string };
            toast.success(
              mode === "create"
                ? "Produto cadastrado com sucesso."
                : "Produto atualizado com sucesso.",
            );
            router.push(`/products/${payload.id}`);
            router.refresh();
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        });
      })}
    >
      <section className="surface-card space-y-5 p-6">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Dados principais
          </h2>
          <p className="text-sm leading-6 text-slate-500">
            Campos estruturados para facilitar busca, filtros e evolucao futura do
            catalogo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Publico
            </label>
            <Select {...register("audience")}>
              <option value="ADULTO">Adulto</option>
              <option value="CRIANCA">Crianca</option>
            </Select>
            <FieldError message={errors.audience?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Categoria
            </label>
            <Select {...register("categoryId")}>
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.categoryId?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Marca
            </label>
            <Select {...register("brandId")}>
              <option value="">Selecione</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.brandId?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <Select {...register("status")}>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </Select>
            <FieldError message={errors.status?.message} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Modelo
            </label>
            <Input
              placeholder="Ex.: Rasteira Riviera Shine"
              {...register("model")}
            />
            <FieldError message={errors.model?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Codigo interno
            </label>
            <Input
              placeholder="Ex.: MOL-RAS-001"
              {...register("internalCode")}
            />
            <FieldError message={errors.internalCode?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cor
            </label>
            <Input placeholder="Ex.: Dourado" {...register("color")} />
            <FieldError message={errors.color?.message} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card space-y-5 p-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Descricao e preco
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Informacoes de atendimento rapido para o vendedor consultar no
              balcão.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Descricao curta
            </label>
            <Textarea
              placeholder="Resumo objetivo do produto, material ou diferencial."
              {...register("shortDescription")}
            />
            <FieldError message={errors.shortDescription?.message} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Preco atual
              </label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0,00"
                {...register("currentPrice", {
                  valueAsNumber: true,
                })}
              />
              <FieldError message={errors.currentPrice?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Preco promocional
              </label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="Opcional"
                {...register("promotionalPrice", {
                  setValueAs: (value) =>
                    value === "" || value === null || value === undefined
                      ? undefined
                      : Number(value),
                })}
              />
              <FieldError message={errors.promotionalPrice?.message} />
            </div>
          </div>
        </div>

        <div className="surface-card space-y-5 p-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Imagem do produto
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Envie uma foto para a Vercel Blob ou informe uma URL publica.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src={previewUrl || DEFAULT_PRODUCT_IMAGE}
              alt="Preview do produto"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 420px"
            />
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Upload de arquivo
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5">
                <UploadCloud className="size-4 text-primary" />
                {selectedFile ? selectedFile.name : "Selecionar imagem"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {uploadEnabled
                  ? "Upload pronto para uso com Vercel Blob."
                  : "Sem token de upload configurado. Voce ainda pode informar uma URL manualmente para testar localmente."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                URL da imagem
              </label>
              <div className="relative">
                <ImagePlus className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  placeholder="https://..."
                  {...register("imageUrl")}
                />
              </div>
              <FieldError message={errors.imageUrl?.message} />
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Numeracoes e estoque
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Cada produto pode ter varias numeracoes com estoque individual.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              append({
                size:
                  Number(fields.at(-1)?.size ?? defaultValues.sizes.at(-1)?.size ?? 34) + 1,
                stock: 0,
              })
            }
          >
            <Plus className="size-4" />
            Adicionar numeracao
          </Button>
        </div>

        <div className="grid gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Numero
                </label>
                <Input
                  type="number"
                  min={15}
                  max={50}
                  {...register(`sizes.${index}.size`, {
                    valueAsNumber: true,
                  })}
                />
                <FieldError
                  message={errors.sizes?.[index]?.size?.message?.toString()}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estoque
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register(`sizes.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                />
                <FieldError
                  message={errors.sizes?.[index]?.stock?.message?.toString()}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  className="w-full text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="size-4" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <FieldError message={errors.sizes?.message?.toString()} />
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={mode === "create" ? "/products" : `/products/${productId}`}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
        <Button size="lg" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Salvando...
            </>
          ) : mode === "create" ? (
            "Cadastrar produto"
          ) : (
            "Salvar alteracoes"
          )}
        </Button>
      </div>
    </form>
  );
}
