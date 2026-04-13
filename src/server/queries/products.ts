import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { tokenizeSearchQuery } from "@/lib/search";
import { parseNumberInput } from "@/lib/utils";
import type {
  ProductDetails,
  ProductFilterOptions,
  ProductFormDefaults,
  ProductListFilters,
  ProductListItem,
  SelectOption,
} from "@/types/product";

export const productListInclude = {
  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  sizes: {
    select: {
      id: true,
      size: true,
      stock: true,
    },
    orderBy: {
      size: "asc",
    },
  },
} satisfies Prisma.ProductInclude;

const productDetailInclude = {
  ...productListInclude,
  createdBy: {
    select: {
      name: true,
    },
  },
  updatedBy: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.ProductInclude;

type ProductListRecord = Prisma.ProductGetPayload<{
  include: typeof productListInclude;
}>;

type ProductDetailRecord = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;

function serializeOption(item: SelectOption) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
  };
}

export function serializeProduct(product: ProductListRecord): ProductListItem {
  const currentPrice = Number(product.currentPrice);
  const promotionalPrice = product.promotionalPrice
    ? Number(product.promotionalPrice)
    : null;

  return {
    id: product.id,
    audience: product.audience,
    model: product.model,
    shortDescription: product.shortDescription,
    color: product.color,
    currentPrice,
    promotionalPrice,
    effectivePrice: promotionalPrice ?? currentPrice,
    internalCode: product.internalCode,
    imageUrl: product.imageUrl,
    totalStock: product.totalStock,
    status: product.status,
    brand: serializeOption(product.brand),
    category: serializeOption(product.category),
    sizes: product.sizes,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function serializeProductDetails(product: ProductDetailRecord): ProductDetails {
  return {
    ...serializeProduct(product),
    createdByName: product.createdBy?.name ?? null,
    updatedByName: product.updatedBy?.name ?? null,
  };
}

function buildPriceWhere(filters: ProductListFilters) {
  if (filters.minPrice === undefined && filters.maxPrice === undefined) {
    return undefined;
  }

  const decimalFilter: Prisma.DecimalFilter = {};

  if (filters.minPrice !== undefined) {
    decimalFilter.gte = new Prisma.Decimal(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    decimalFilter.lte = new Prisma.Decimal(filters.maxPrice);
  }

  return {
    OR: [
      {
        promotionalPrice: decimalFilter as Prisma.DecimalNullableFilter,
      },
      {
        promotionalPrice: null,
        currentPrice: decimalFilter,
      },
    ],
  } satisfies Prisma.ProductWhereInput;
}

export function buildProductWhere(filters: ProductListFilters) {
  const conditions: Prisma.ProductWhereInput[] = [];

  if (filters.status !== "ALL") {
    conditions.push({
      status: filters.status,
    });
  }

  if (filters.audience) {
    conditions.push({
      audience: filters.audience,
    });
  }

  if (filters.categoryId) {
    conditions.push({
      categoryId: filters.categoryId,
    });
  }

  if (filters.brandId) {
    conditions.push({
      brandId: filters.brandId,
    });
  }

  if (filters.color) {
    conditions.push({
      color: {
        contains: filters.color,
        mode: "insensitive",
      },
    });
  }

  if (filters.size) {
    conditions.push({
      sizes: {
        some: {
          size: filters.size,
        },
      },
    });
  }

  if (filters.inStock) {
    conditions.push({
      totalStock: {
        gt: 0,
      },
    });
  }

  if (filters.promotion) {
    conditions.push({
      promotionalPrice: {
        not: null,
      },
    });
  }

  const priceWhere = buildPriceWhere(filters);

  if (priceWhere) {
    conditions.push(priceWhere);
  }

  const tokens = tokenizeSearchQuery(filters.query);

  tokens.forEach((token) => {
    conditions.push({
      searchDocument: {
        contains: token,
      },
    });
  });

  if (!conditions.length) {
    return {};
  }

  return {
    AND: conditions,
  };
}

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parseProductListFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProductListFilters {
  const query = readParam(searchParams, "q")?.trim() ?? "";
  const audience = readParam(searchParams, "audience");
  const status = readParam(searchParams, "status");
  const categoryId = readParam(searchParams, "categoryId") ?? "";
  const brandId = readParam(searchParams, "brandId") ?? "";
  const color = readParam(searchParams, "color") ?? "";
  const size = parseNumberInput(readParam(searchParams, "size"));
  const minPrice = parseNumberInput(readParam(searchParams, "minPrice"));
  const maxPrice = parseNumberInput(readParam(searchParams, "maxPrice"));

  return {
    query,
    audience:
      audience === "ADULTO" || audience === "CRIANCA" ? audience : undefined,
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    color: color || undefined,
    size,
    minPrice,
    maxPrice,
    promotion: readParam(searchParams, "promotion") === "true",
    inStock: readParam(searchParams, "inStock") === "true",
    status:
      status === ProductStatus.ACTIVE || status === ProductStatus.INACTIVE
        ? status
        : "ALL",
  };
}

export async function getProductFilterOptions(): Promise<ProductFilterOptions> {
  const [categories, brands, colors] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.product.findMany({
      select: {
        color: true,
      },
    }),
  ]);

  const colorOptions = [...new Set(colors.map((item) => item.color.trim()))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, "pt-BR"));

  return {
    categories,
    brands,
    colors: colorOptions,
  };
}

export async function getProducts(filters: ProductListFilters) {
  const products = await prisma.product.findMany({
    where: buildProductWhere(filters),
    include: productListInclude,
    orderBy: [
      {
        status: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return products.map(serializeProduct);
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: productDetailInclude,
  });

  if (!product) {
    return null;
  }

  return serializeProductDetails(product);
}

export async function getProductForEdit(id: string): Promise<ProductFormDefaults | null> {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      sizes: {
        select: {
          size: true,
          stock: true,
        },
        orderBy: {
          size: "asc",
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    audience: product.audience,
    categoryId: product.categoryId,
    brandId: product.brandId,
    model: product.model,
    shortDescription: product.shortDescription,
    color: product.color,
    currentPrice: Number(product.currentPrice),
    promotionalPrice: product.promotionalPrice
      ? Number(product.promotionalPrice)
      : undefined,
    internalCode: product.internalCode,
    imageUrl: product.imageUrl,
    status: product.status,
    sizes: product.sizes,
  };
}
