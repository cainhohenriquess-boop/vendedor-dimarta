import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function getApiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
        {
          error: error.issues[0]?.message ?? "Dados inválidos.",
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
          error: "Já existe um registro com este valor único.",
        },
        {
          status: 409,
        },
      );
    }

    if (error.code === "P2025") {
      return Response.json(
        {
          error: "Registro não encontrado.",
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
