import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { canManageUsers } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/prisma";
import { roleUpdateSchema } from "@/app/lib/validators";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = roleUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await context.params;

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return NextResponse.json(updated);
}
