import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { mosqueSchema } from "@/app/lib/validators";
import { canCreateMosque } from "@/app/lib/permissions";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.max(1, Math.min(50, Number(searchParams.get("pageSize") || 6)));

  const [total, data] = await Promise.all([
    prisma.mosque.count(),
    prisma.mosque.findMany({
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !canCreateMosque(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = mosqueSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const mosque = await prisma.mosque.create({
    data: {
      ...data,
      image: data.image || null
    }
  });

  return NextResponse.json(mosque, { status: 201 });
}
