"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MOSQUE_IMAGE_FALLBACK } from "@/app/lib/constants";
import { getTimingsForMosque, to12Hour, upcomingSalahLabel, DailyStarts } from "@/app/lib/prayer";
import { MosqueRecord } from "@/app/types";

type Props = {
  mosque: MosqueRecord;
  dailyStarts: DailyStarts;
};

export default function MosqueCard({ mosque, dailyStarts }: Props) {
  const [src, setSrc] = useState(mosque.image || MOSQUE_IMAGE_FALLBACK);
  const timings = useMemo(() => getTimingsForMosque(mosque, dailyStarts), [mosque, dailyStarts]);
  const nextSalah = useMemo(() => upcomingSalahLabel(timings), [timings]);

  return (
    <article className="glass-card rounded-2xl overflow-hidden">
      <Image
        src={src}
        alt={mosque.name}
        width={1200}
        height={400}
        className="h-40 w-full object-cover"
        onError={() => setSrc(MOSQUE_IMAGE_FALLBACK)}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{mosque.name}</h3>
        <p className="text-sm text-[#c7d9ff]/80 mb-3">{mosque.location}</p>
        <ul className="space-y-2 text-sm">
          {Object.entries(timings).map(([name, value]) => (
            <li
              key={name}
              className={`flex items-center justify-between px-2 py-1 rounded-md ${
                name === nextSalah ? "upcoming-time" : "bg-white/[0.03]"
              }`}
            >
              <span>{name}</span>
              <span className="font-semibold">{to12Hour(value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
