import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, authCookieOptions, signAuthToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { loginSchema } from "@/app/lib/validators";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions());

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
