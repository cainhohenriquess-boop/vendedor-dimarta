import { ProductAudience, ProductStatus } from "@prisma/client";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { z } from "zod";

const sizeSchema = z.object({
  size: z.number().int().min(15).max(50),
  stock: z.number().int().min(0).max(9999),
});

export const productFormSchema = z
  .object({
    audience: z.nativeEnum(ProductAudience),
    categoryId: z.string().trim().min(1, "Selecione a categoria."),
    brandId: z.string().trim().min(1, "Selecione a marca."),
    model: z.string().trim().min(2, "Informe o modelo.").max(120),
    shortDescription: z
      .string()
      .trim()
      .min(4, "Informe uma descricao curta.")
      .max(180),
    color: z.string().trim().min(2, "Informe a cor.").max(80),
    currentPrice: z.number().positive("Informe um preco atual valido."),
    promotionalPrice: z
      .number()
      .positive("Informe um preco promocional valido.")
      .optional(),
    internalCode: z
      .string()
      .trim()
      .min(3, "Informe o codigo interno.")
      .max(40)
      .regex(
        /^[A-Za-z0-9-_]+$/,
        "Use apenas letras, numeros, hifen e underscore no codigo.",
      ),
    imageUrl: z
      .string()
      .trim()
      .min(1, "Adicione uma imagem.")
      .refine(
        (value) => value.startsWith("/") || /^https?:\/\//.test(value),
        "Informe uma URL valida ou envie um arquivo.",
      ),
    status: z.nativeEnum(ProductStatus),
    sizes: z.array(sizeSchema).min(1, "Adicione ao menos uma numeracao."),
  })
  .superRefine((value, context) => {
    if (
      typeof value.promotionalPrice === "number" &&
      value.promotionalPrice >= value.currentPrice
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preco promocional deve ser menor que o preco atual.",
        path: ["promotionalPrice"],
      });
    }

    const seenSizes = new Set<number>();

    value.sizes.forEach((sizeItem, index) => {
      if (seenSizes.has(sizeItem.size)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nao repita a mesma numeracao.",
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
  model: "",
  shortDescription: "",
  color: "",
  currentPrice: 0,
  promotionalPrice: undefined,
  internalCode: "",
  imageUrl: DEFAULT_PRODUCT_IMAGE,
  status: ProductStatus.ACTIVE,
  sizes: [{ size: 34, stock: 0 }],
};
