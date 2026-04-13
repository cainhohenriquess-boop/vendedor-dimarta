import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { MAX_UPLOAD_SIZE_BYTES, isBlobUploadConfigured } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return Response.json(
    {
      error: "Sessão expirada. Faça login novamente.",
    },
    {
      status: 401,
    },
  );
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse();
    }

    if (!isBlobUploadConfigured()) {
      return Response.json(
        {
          error: "BLOB_READ_WRITE_TOKEN não configurado.",
        },
        {
          status: 500,
        },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          error: "Nenhum arquivo enviado.",
        },
        {
          status: 400,
        },
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        {
          error: "Envie apenas arquivos de imagem.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return Response.json(
        {
          error: "A imagem excede o limite permitido de 4 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const blob = await put(
      `products/${Date.now()}-${sanitizeFileName(file.name)}`,
      file,
      {
        access: "public",
        contentType: file.type,
      },
    );

    return Response.json({
      url: blob.url,
    });
  } catch (error) {
    console.error("Falha no upload para Vercel Blob:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? `Falha ao enviar a imagem: ${error.message}`
            : "Falha ao enviar a imagem.",
      },
      {
        status: 500,
      },
    );
  }
}
