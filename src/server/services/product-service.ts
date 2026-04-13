import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildProductSearchDocument } from "@/lib/search";
import {
  productFormSchema,
  type ProductFormInput,
} from "@/lib/validations/product";

function normalizeProductInput(input: ProductFormInput) {
  const parsed = productFormSchema.parse(input);

  return {
    ...parsed,
    internalCode: parsed.internalCode.toUpperCase(),
    promotionalPrice: parsed.promotionalPrice ?? null,
    sizes: [...parsed.sizes].sort((left, right) => left.size - right.size),
  };
}

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

async function getReferences(
  tx: Prisma.TransactionClient,
  categoryId: string,
  brandId: string,
) {
  const [category, brand] = await Promise.all([
    tx.category.findUnique({
      where: {
        id: categoryId,
      },
    }),
    tx.brand.findUnique({
      where: {
        id: brandId,
      },
    }),
  ]);

  if (!category || !brand) {
    throw new Error("Categoria ou marca invalida.");
  }

  return {
    category,
    brand,
  };
}

function buildBaseProductData(
  values: ReturnType<typeof normalizeProductInput>,
  references: Awaited<ReturnType<typeof getReferences>>,
  userId: string,
) {
  const totalStock = values.sizes.reduce((total, size) => total + size.stock, 0);

  return {
    audience: values.audience,
    categoryId: values.categoryId,
    brandId: values.brandId,
    model: values.model,
    shortDescription: values.shortDescription,
    color: values.color,
    currentPrice: toDecimal(values.currentPrice),
    promotionalPrice:
      typeof values.promotionalPrice === "number"
        ? toDecimal(values.promotionalPrice)
        : null,
    internalCode: values.internalCode,
    imageUrl: values.imageUrl,
    status: values.status,
    totalStock,
    searchDocument: buildProductSearchDocument({
      audience: values.audience,
      brandName: references.brand.name,
      categoryName: references.category.name,
      model: values.model,
      shortDescription: values.shortDescription,
      color: values.color,
      internalCode: values.internalCode,
      sizes: values.sizes.map((size) => size.size),
    }),
    updatedById: userId,
  };
}

export async function createProduct(input: ProductFormInput, userId: string) {
  const values = normalizeProductInput(input);

  return prisma.$transaction(async (tx) => {
    const references = await getReferences(tx, values.categoryId, values.brandId);
    const baseData = buildBaseProductData(values, references, userId);

    return tx.product.create({
      data: {
        ...baseData,
        createdById: userId,
        sizes: {
          create: values.sizes,
        },
      },
      select: {
        id: true,
      },
    });
  });
}

export async function updateProduct(
  productId: string,
  input: ProductFormInput,
  userId: string,
) {
  const values = normalizeProductInput(input);

  return prisma.$transaction(async (tx) => {
    const references = await getReferences(tx, values.categoryId, values.brandId);
    const baseData = buildBaseProductData(values, references, userId);

    return tx.product.update({
      where: {
        id: productId,
      },
      data: {
        ...baseData,
        sizes: {
          deleteMany: {},
          create: values.sizes,
        },
      },
      select: {
        id: true,
      },
    });
  });
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });
}
