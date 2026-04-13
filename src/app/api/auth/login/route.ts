import { authenticateSeller } from "@/lib/auth";
import { createSessionCookie } from "@/lib/auth/session";
import { getApiErrorResponse } from "@/lib/api";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const credentials = loginSchema.parse(body);
    const user = await authenticateSeller(credentials.email, credentials.password);

    if (!user) {
      return Response.json(
        {
          error: "E-mail ou senha invalidos.",
        },
        {
          status: 401,
        },
      );
    }

    await createSessionCookie({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    return getApiErrorResponse(error);
  }
}
