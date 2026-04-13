import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildProductSearchDocument } from "@/lib/search";
import { slugify } from "@/lib/utils";
import { CREATE_NEW_OPTION_VALUE } from "@/lib/constants";
import {
  productFormSchema,
  type ProductFormInput,
} from "@/lib/validations/product";

function normalizeProductInput(input: ProductFormInput) {
  const parsed = productFormSchema.parse(input);

  return {
    ...parsed,
    promotionalPrice: parsed.promotionalPrice ?? null,
    sizes: [...parsed.sizes].sort((left, right) => left.size - right.size),
  };
}

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

async function getReferences(
  tx: Prisma.TransactionClient,
  values: ReturnType<typeof normalizeProductInput>,
) {
  const category =
    values.categoryId === CREATE_NEW_OPTION_VALUE
      ? await tx.category.upsert({
          where: {
            slug: slugify(values.newCategoryName ?? ""),
          },
          update: {},
          create: {
            name: values.newCategoryName!.trim(),
            slug: slugify(values.newCategoryName ?? ""),
          },
        })
      : await tx.category.findUnique({
          where: {
            id: values.categoryId,
          },
        });

  const brand =
    values.brandId === CREATE_NEW_OPTION_VALUE
      ? await tx.brand.upsert({
          where: {
            slug: slugify(values.newBrandName ?? ""),
          },
          update: {},
          create: {
            name: values.newBrandName!.trim(),
            slug: slugify(values.newBrandName ?? ""),
          },
        })
      : await tx.brand.findUnique({
          where: {
            id: values.brandId,
          },
        });

  if (!category || !brand) {
    throw new Error("Categoria ou marca inválida.");
  }

  return {
    category,
    brand,
  };
}

function buildAutomaticShortDescription(
  values: ReturnType<typeof normalizeProductInput>,
  references: Awaited<ReturnType<typeof getReferences>>,
) {
  return `${references.category.name} ${values.model} da marca ${references.brand.name} na cor ${values.color}.`;
}

function buildInternalCode(
  references: Awaited<ReturnType<typeof getReferences>>,
  existingCode?: string,
) {
  if (existingCode) {
    return existingCode;
  }

  const brandPrefix = slugify(references.brand.name)
    .replace(/-/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const categoryPrefix = slugify(references.category.name)
    .replace(/-/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const randomSuffix = crypto.randomUUID().slice(0, 6).toUpperCase();

  return `DM-${brandPrefix}-${categoryPrefix}-${randomSuffix}`;
}

function buildBaseProductData(
  values: ReturnType<typeof normalizeProductInput>,
  references: Awaited<ReturnType<typeof getReferences>>,
  userId: string,
  existingCode?: string,
) {
  const totalStock = values.sizes.reduce((total, size) => total + size.stock, 0);
  const shortDescription = buildAutomaticShortDescription(values, references);
  const internalCode = buildInternalCode(references, existingCode);

  return {
    audience: values.audience,
    categoryId: references.category.id,
    brandId: references.brand.id,
    model: values.model,
    shortDescription,
    color: values.color,
    currentPrice: toDecimal(values.currentPrice),
    promotionalPrice:
      typeof values.promotionalPrice === "number"
        ? toDecimal(values.promotionalPrice)
        : null,
    internalCode,
    imageUrl: values.imageUrl,
    status: values.status,
    totalStock,
    searchDocument: buildProductSearchDocument({
      audience: values.audience,
      brandName: references.brand.name,
      categoryName: references.category.name,
      model: values.model,
      shortDescription,
      color: values.color,
      internalCode,
      sizes: values.sizes.map((size) => size.size),
    }),
    updatedById: userId,
  };
}

export async function createProduct(input: ProductFormInput, userId: string) {
  const values = normalizeProductInput(input);

  return prisma.$transaction(async (tx) => {
    const references = await getReferences(tx, values);
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
    const existingProduct = await tx.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
      select: {
        internalCode: true,
      },
    });
    const references = await getReferences(tx, values);
    const baseData = buildBaseProductData(
      values,
      references,
      userId,
      existingProduct.internalCode,
    );

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
