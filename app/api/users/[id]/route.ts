import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { canManageUsers } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  if (id === user.sub) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
