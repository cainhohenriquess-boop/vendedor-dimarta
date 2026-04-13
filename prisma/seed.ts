import bcrypt from "bcryptjs";
import {
  PrismaClient,
  ProductAudience,
  ProductStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(value: string) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildSearchDocument(input: {
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

async function main() {
  const sellerPassword = await bcrypt.hash("12345678", 10);

  const seller = await prisma.user.upsert({
    where: { email: "vendedor@dimarta.com" },
    update: {
      name: "Vendedor Dimarta",
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      isActive: true,
    },
    create: {
      name: "Vendedor Dimarta",
      email: "vendedor@dimarta.com",
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
    },
  });

  const categoryNames = [
    "Rasteira",
    "Sandalia",
    "Tenis",
    "Bota",
    "Chinelo",
  ];
  const brandNames = ["Moleca", "Klin", "Via Marte", "Beira Rio"];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) },
      }),
    ),
  );

  const brands = await Promise.all(
    brandNames.map((name) =>
      prisma.brand.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) },
      }),
    ),
  );

  const categoryByName = new Map(categories.map((item) => [item.name, item]));
  const brandByName = new Map(brands.map((item) => [item.name, item]));

  const products = [
    {
      audience: ProductAudience.ADULTO,
      categoryName: "Rasteira",
      brandName: "Moleca",
      model: "Rasteira Riviera Shine",
      shortDescription:
        "Rasteira dourada com tiras metalizadas e palmilha macia para atendimento rapido no dia a dia.",
      color: "Dourado",
      currentPrice: 129.9,
      promotionalPrice: 99.9,
      internalCode: "MOL-RAS-001",
      imageUrl: "/demo-images/rasteira-dourada.svg",
      status: ProductStatus.ACTIVE,
      sizes: [
        { size: 34, stock: 2 },
        { size: 35, stock: 4 },
        { size: 36, stock: 3 },
        { size: 37, stock: 1 },
      ],
    },
    {
      audience: ProductAudience.CRIANCA,
      categoryName: "Sandalia",
      brandName: "Klin",
      model: "Sandalia Play Urban",
      shortDescription:
        "Sandalia infantil preta com fechamento facil e sola leve para uso diario.",
      color: "Preto",
      currentPrice: 149.9,
      promotionalPrice: null,
      internalCode: "KLN-SAN-028",
      imageUrl: "/demo-images/sandalia-infantil-preta.svg",
      status: ProductStatus.ACTIVE,
      sizes: [
        { size: 27, stock: 2 },
        { size: 28, stock: 5 },
        { size: 29, stock: 3 },
        { size: 30, stock: 1 },
      ],
    },
    {
      audience: ProductAudience.ADULTO,
      categoryName: "Tenis",
      brandName: "Beira Rio",
      model: "Tenis City Flow",
      shortDescription:
        "Tenis casual branco com acabamento limpo para vitrines e atendimento no balcao.",
      color: "Branco",
      currentPrice: 219.9,
      promotionalPrice: 189.9,
      internalCode: "BER-TEN-014",
      imageUrl: "/demo-images/tenis-branco.svg",
      status: ProductStatus.ACTIVE,
      sizes: [
        { size: 35, stock: 1 },
        { size: 36, stock: 2 },
        { size: 37, stock: 2 },
        { size: 38, stock: 4 },
      ],
    },
    {
      audience: ProductAudience.ADULTO,
      categoryName: "Bota",
      brandName: "Via Marte",
      model: "Bota Chelsea Soft",
      shortDescription:
        "Bota preta de cano curto com visual elegante para colecao de inverno.",
      color: "Preto",
      currentPrice: 289.9,
      promotionalPrice: null,
      internalCode: "VIM-BOT-020",
      imageUrl: "/demo-images/bota-preta.svg",
      status: ProductStatus.ACTIVE,
      sizes: [
        { size: 36, stock: 0 },
        { size: 37, stock: 1 },
        { size: 38, stock: 2 },
        { size: 39, stock: 1 },
      ],
    },
    {
      audience: ProductAudience.ADULTO,
      categoryName: "Chinelo",
      brandName: "Moleca",
      model: "Chinelo Confort Soft",
      shortDescription:
        "Chinelo nude com palmilha anatomica para venda rapida em dias quentes.",
      color: "Nude",
      currentPrice: 79.9,
      promotionalPrice: 69.9,
      internalCode: "MOL-CHI-003",
      imageUrl: "/demo-images/chinelo-nude.svg",
      status: ProductStatus.INACTIVE,
      sizes: [
        { size: 34, stock: 0 },
        { size: 35, stock: 0 },
        { size: 36, stock: 2 },
      ],
    },
  ];

  for (const product of products) {
    const category = categoryByName.get(product.categoryName);
    const brand = brandByName.get(product.brandName);

    if (!category || !brand) {
      throw new Error(`Categoria ou marca nao encontrada para ${product.model}.`);
    }

    const totalStock = product.sizes.reduce((total, size) => total + size.stock, 0);
    const searchDocument = buildSearchDocument({
      audience: product.audience,
      brandName: product.brandName,
      categoryName: product.categoryName,
      model: product.model,
      shortDescription: product.shortDescription,
      color: product.color,
      internalCode: product.internalCode,
      sizes: product.sizes.map((size) => size.size),
    });

    await prisma.product.upsert({
      where: { internalCode: product.internalCode },
      update: {
        audience: product.audience,
        model: product.model,
        shortDescription: product.shortDescription,
        color: product.color,
        currentPrice: product.currentPrice,
        promotionalPrice: product.promotionalPrice,
        imageUrl: product.imageUrl,
        status: product.status,
        searchDocument,
        totalStock,
        categoryId: category.id,
        brandId: brand.id,
        createdById: seller.id,
        updatedById: seller.id,
        sizes: {
          deleteMany: {},
          create: product.sizes,
        },
      },
      create: {
        audience: product.audience,
        model: product.model,
        shortDescription: product.shortDescription,
        color: product.color,
        currentPrice: product.currentPrice,
        promotionalPrice: product.promotionalPrice,
        internalCode: product.internalCode,
        imageUrl: product.imageUrl,
        status: product.status,
        searchDocument,
        totalStock,
        categoryId: category.id,
        brandId: brand.id,
        createdById: seller.id,
        updatedById: seller.id,
        sizes: {
          create: product.sizes,
        },
      },
    });
  }

  console.log("Seed concluido com usuario vendedor e produtos de exemplo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
