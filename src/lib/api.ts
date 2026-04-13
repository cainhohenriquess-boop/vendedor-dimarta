import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function getApiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: error.issues[0]?.message ?? "Dados invalidos.",
      },
      {
        status: 400,
      },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return Response.json(
        {
          error: "Ja existe um registro com este valor unico.",
        },
        {
          status: 409,
        },
      );
    }

    if (error.code === "P2025") {
      return Response.json(
        {
          error: "Registro nao encontrado.",
        },
        {
          status: 404,
        },
      );
    }
  }

  return Response.json(
    {
      error:
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
    },
    {
      status: 500,
    },
  );
}
