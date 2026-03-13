import HomeClient from "@/app/components/HomeClient";
import { getPrayerStarts } from "@/app/lib/prayer-starts";
import { prisma } from "@/app/lib/prisma";

export const revalidate = 0;

export default async function Page() {
  const [mosques, dailyStarts] = await Promise.all([
    prisma.mosque.findMany({ orderBy: { createdAt: "asc" } }),
    getPrayerStarts()
  ]);

  return (
    <HomeClient
      mosques={mosques.map((m) => ({
        ...m,
         image: m.image ?? undefined,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString()
      }))}
      dailyStarts={dailyStarts}
    />
  );
}
