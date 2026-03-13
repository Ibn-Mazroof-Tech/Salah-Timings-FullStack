import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { AUTH_COOKIE_NAME, authCookieOptions, getCurrentUser, hashPassword, signAuthToken } from "@/app/lib/auth";
import { canManageUsers } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/prisma";
import { registerSchema } from "@/app/lib/validators";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userCount = await prisma.user.count();
  const current = await getCurrentUser();

  if (userCount > 0 && (!current || !canManageUsers(current.role))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const role = userCount === 0 ? Role.ADMIN : Role.EDITOR;
  const passwordHash = await hashPassword(parsed.data.password);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role
    }
  });

  if (userCount === 0) {
    const token = await signAuthToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, authCookieOptions());
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
