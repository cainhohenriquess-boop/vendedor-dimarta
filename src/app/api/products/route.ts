import { getCurrentUser } from "@/lib/auth";
import { getApiErrorResponse } from "@/lib/api";
import {
  getProducts,
  parseProductListFilters,
} from "@/server/queries/products";
import { createProduct } from "@/server/services/product-service";

function unauthorizedResponse() {
  return Response.json(
    {
      error: "Sessao expirada. Faca login novamente.",
    },
    {
      status: 401,
    },
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filters = parseProductListFilters(Object.fromEntries(url.searchParams));
    const products = await getProducts(filters);

    return Response.json(products);
  } catch (error) {
    return getApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const created = await createProduct(body, user.id);

    return Response.json(
      {
        id: created.id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return getApiErrorResponse(error);
  }
}
