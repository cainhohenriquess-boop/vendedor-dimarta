import { ProductAudience, ProductStatus } from "@prisma/client";

export const APP_NAME = "Dimarta Vendas";
export const DEFAULT_PRODUCT_IMAGE = "/demo-images/default-shoe.svg";
export const LOW_STOCK_THRESHOLD = 3;
export const MAX_UPLOAD_SIZE_MB = 4;
export const CREATE_NEW_OPTION_VALUE = "__new__";

export const AUDIENCE_LABELS: Record<ProductAudience, string> = {
  ADULTO: "Adulto",
  CRIANCA: "Criança",
};

export const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const PRODUCT_AUDIENCE_OPTIONS = [
  { value: ProductAudience.ADULTO, label: AUDIENCE_LABELS.ADULTO },
  { value: ProductAudience.CRIANCA, label: AUDIENCE_LABELS.CRIANCA },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: ProductStatus.ACTIVE, label: STATUS_LABELS.ACTIVE },
  { value: ProductStatus.INACTIVE, label: STATUS_LABELS.INACTIVE },
];

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Produtos" },
  { href: "/promissorias", label: "Promissórias" },
  { href: "/products/new", label: "Cadastrar" },
];
