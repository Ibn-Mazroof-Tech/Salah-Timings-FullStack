"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MosqueCard from "@/app/components/MosqueCard";
import PaginationControls from "@/app/components/PaginationControls";
import { PAGE_SIZE } from "@/app/lib/constants";
import { DailyStarts } from "@/app/lib/prayer";
import { MosqueRecord } from "@/app/types";

type Props = {
  mosques: MosqueRecord[];
  dailyStarts: DailyStarts;
};

export default function HomeClient({ mosques, dailyStarts }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(mosques.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);

  const list = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return mosques.slice(start, start + PAGE_SIZE);
  }, [clampedPage, mosques]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">?? Mosque Jama&apos;at Times</h1>
          <p className="text-sm text-[#c7d9ff]/80">Simple, clean, and manually manageable cards for multiple mosques.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin" className="rounded-lg bg-[#c7d9ff] text-[#0b1d3a] font-semibold px-4 py-2 text-sm">
            + Add Mosque
          </Link>
          <span className="text-xs text-[#e6f0ff]/75">
            Sunrise {dailyStarts.Sunrise} � Asr start {dailyStarts.Asr} � Maghrib {dailyStarts.Maghrib} � Isha start {dailyStarts.Isha}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((mosque) => (
          <MosqueCard key={mosque.id} mosque={mosque} dailyStarts={dailyStarts} />
        ))}
      </section>

      <PaginationControls
        page={clampedPage}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />
    </div>
  );
}
