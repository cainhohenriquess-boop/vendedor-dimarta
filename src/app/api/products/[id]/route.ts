import { getCurrentUser } from "@/lib/auth";
import { getApiErrorResponse } from "@/lib/api";
import { getProductById } from "@/server/queries/products";
import {
  deleteProduct,
  updateProduct,
} from "@/server/services/product-service";

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

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);

    if (!product) {
      return Response.json(
        {
          error: "Produto nao encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(product);
  } catch (error) {
    return getApiErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: ProductRouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateProduct(id, body, user.id);

    return Response.json({
      id: updated.id,
    });
  } catch (error) {
    return getApiErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    await deleteProduct(id);

    return Response.json({
      ok: true,
    });
  } catch (error) {
    return getApiErrorResponse(error);
  }
}
