import { ProductAudience, ProductStatus } from "@prisma/client";

export type SelectOption = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSizeItem = {
  id?: string;
  size: number;
  stock: number;
};

export type ProductListItem = {
  id: string;
  audience: ProductAudience;
  model: string;
  shortDescription: string;
  color: string;
  currentPrice: number;
  promotionalPrice: number | null;
  effectivePrice: number;
  internalCode: string;
  imageUrl: string;
  totalStock: number;
  status: ProductStatus;
  brand: SelectOption;
  category: SelectOption;
  sizes: ProductSizeItem[];
  createdAt: string;
  updatedAt: string;
};

export type ProductDetails = ProductListItem & {
  createdByName?: string | null;
  updatedByName?: string | null;
};

export type ProductFormDefaults = {
  audience: ProductAudience;
  categoryId: string;
  brandId: string;
  newCategoryName?: string;
  newBrandName?: string;
  model: string;
  shortDescription: string;
  color: string;
  currentPrice: number;
  promotionalPrice?: number;
  internalCode: string;
  imageUrl: string;
  status: ProductStatus;
  sizes: ProductSizeItem[];
};

export type ProductFilterOptions = {
  categories: SelectOption[];
  brands: SelectOption[];
  colors: string[];
};

export type ProductListFilters = {
  query: string;
  audience?: ProductAudience;
  categoryId?: string;
  brandId?: string;
  color?: string;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  promotion: boolean;
  inStock: boolean;
  status: ProductStatus | "ALL";
};

export type DashboardMetrics = {
  totalProducts: number;
  activeProducts: number;
  promotionalProducts: number;
  lowStockProducts: number;
  totalUnits: number;
  recentProducts: ProductListItem[];
};
