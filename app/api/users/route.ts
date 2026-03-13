import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { canManageUsers } from "@/app/lib/permissions";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return NextResponse.json(users);
}
