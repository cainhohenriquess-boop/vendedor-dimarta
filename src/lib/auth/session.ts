import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { type JWTPayload, SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "dimarta_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

type SessionPayload = JWTPayload & SessionUser;

function getJwtSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (secret) {
    return new TextEncoder().encode(secret);
  }

  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("dimarta-dev-secret");
  }

  throw new Error("AUTH_SECRET nao configurado.");
}

export async function signSessionToken(user: SessionUser) {
  return new SignJWT({
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(user.userId)
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const session = payload as SessionPayload;

    if (!session.sub || !session.email || !session.name || !session.role) {
      return null;
    }

    return {
      userId: session.sub,
      email: session.email,
      name: session.name,
      role: session.role,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}

export async function createSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  const token = await signSessionToken(user);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return verifySessionToken(token);
}
