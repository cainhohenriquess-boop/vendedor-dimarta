import { ProductAudience } from "@prisma/client";
import { normalizeSearchText } from "@/lib/utils";

export function buildProductSearchDocument(input: {
  audience: ProductAudience;
  brandName: string;
  categoryName: string;
  model: string;
  shortDescription: string;
  color: string;
  internalCode: string;
  sizes: number[];
}) {
  const audienceTerms =
    input.audience === ProductAudience.CRIANCA
      ? "crianca infantil kids juvenil"
      : "adulto";

  return normalizeSearchText(
    [
      audienceTerms,
      input.brandName,
      input.categoryName,
      input.model,
      input.shortDescription,
      input.color,
      input.internalCode,
      input.sizes.join(" "),
    ].join(" "),
  );
}

export function tokenizeSearchQuery(query: string) {
  return normalizeSearchText(query)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}
