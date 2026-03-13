import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { mosqueSchema } from "@/app/lib/validators";
import { canDeleteMosque, canEditMosque } from "@/app/lib/permissions";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const mosque = await prisma.mosque.findUnique({ where: { id } });

  if (!mosque) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(mosque);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canEditMosque(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = mosqueSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await context.params;

  const updated = await prisma.mosque.update({
    where: { id },
    data: {
      ...parsed.data,
      image: parsed.data.image || null
    }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canDeleteMosque(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  await prisma.mosque.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
