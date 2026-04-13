import { ProductStatus } from "@prisma/client";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { productListInclude, serializeProduct } from "@/server/queries/products";
import type { DashboardMetrics } from "@/types/product";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [
    totalProducts,
    activeProducts,
    promotionalProducts,
    lowStockProducts,
    totalUnits,
    recentProducts,
  ] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE,
      },
    }),
    prisma.product.count({
      where: {
        promotionalPrice: {
          not: null,
        },
      },
    }),
    prisma.product.count({
      where: {
        totalStock: {
          gt: 0,
          lte: LOW_STOCK_THRESHOLD,
        },
      },
    }),
    prisma.product.aggregate({
      _sum: {
        totalStock: true,
      },
    }),
    prisma.product.findMany({
      include: productListInclude,
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
    }),
  ]);

  return {
    totalProducts,
    activeProducts,
    promotionalProducts,
    lowStockProducts,
    totalUnits: totalUnits._sum.totalStock ?? 0,
    recentProducts: recentProducts.map(serializeProduct),
  };
}
