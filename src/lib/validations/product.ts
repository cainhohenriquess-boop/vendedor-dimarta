import { ProductAudience, ProductStatus } from "@prisma/client";
import { z } from "zod";
import {
  CREATE_NEW_OPTION_VALUE,
  DEFAULT_PRODUCT_IMAGE,
} from "@/lib/constants";

const sizeSchema = z.object({
  size: z.number().int().min(15).max(50),
  stock: z.number().int().min(0).max(9999),
});

export const productFormSchema = z
  .object({
    audience: z.nativeEnum(ProductAudience),
    categoryId: z.string().trim(),
    brandId: z.string().trim(),
    newCategoryName: z.string().trim().max(80).optional(),
    newBrandName: z.string().trim().max(80).optional(),
    model: z.string().trim().min(2, "Informe o modelo.").max(120),
    color: z.string().trim().min(2, "Informe a cor.").max(80),
    currentPrice: z.number().positive("Informe um preço atual válido."),
    promotionalPrice: z
      .number()
      .positive("Informe um preço promocional válido.")
      .optional(),
    imageUrl: z
      .string()
      .trim()
      .min(1, "Adicione uma imagem.")
      .refine(
        (value) => value.startsWith("/") || /^https?:\/\//.test(value),
        "Informe uma URL válida ou envie um arquivo.",
      ),
    status: z.nativeEnum(ProductStatus),
    sizes: z.array(sizeSchema).min(1, "Adicione ao menos uma numeração."),
  })
  .superRefine((value, context) => {
    const categoryId = value.categoryId.trim();
    const brandId = value.brandId.trim();
    const newCategoryName = value.newCategoryName?.trim();
    const newBrandName = value.newBrandName?.trim();

    if (!categoryId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma categoria ou cadastre uma nova.",
        path: ["categoryId"],
      });
    }

    if (categoryId === CREATE_NEW_OPTION_VALUE && !newCategoryName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o nome da nova categoria.",
        path: ["newCategoryName"],
      });
    }

    if (!brandId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma marca ou cadastre uma nova.",
        path: ["brandId"],
      });
    }

    if (brandId === CREATE_NEW_OPTION_VALUE && !newBrandName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o nome da nova marca.",
        path: ["newBrandName"],
      });
    }

    if (
      typeof value.promotionalPrice === "number" &&
      value.promotionalPrice >= value.currentPrice
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preço promocional deve ser menor que o preço atual.",
        path: ["promotionalPrice"],
      });
    }

    const seenSizes = new Set<number>();

    value.sizes.forEach((sizeItem, index) => {
      if (seenSizes.has(sizeItem.size)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Não repita a mesma numeração.",
          path: ["sizes", index, "size"],
        });
      }

      seenSizes.add(sizeItem.size);
    });
  });

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export const defaultProductValues: ProductFormValues = {
  audience: ProductAudience.ADULTO,
  categoryId: "",
  brandId: "",
  newCategoryName: "",
  newBrandName: "",
  model: "",
  color: "",
  currentPrice: 0,
  promotionalPrice: undefined,
  imageUrl: DEFAULT_PRODUCT_IMAGE,
  status: ProductStatus.ACTIVE,
  sizes: [{ size: 34, stock: 0 }],
};
