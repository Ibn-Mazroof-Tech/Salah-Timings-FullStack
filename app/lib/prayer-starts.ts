import { unstable_cache } from "next/cache";
import { DailyStarts, fallbackDailyStarts } from "@/app/lib/prayer";

const ALADHAN_URL =
  "https://api.aladhan.com/v1/timingsByCity?city=New%20Delhi&country=India&method=1&school=1";

async function fetchPrayerStartsRaw(): Promise<DailyStarts> {
  try {
    const response = await fetch(ALADHAN_URL, { next: { revalidate: 86400 } });
    if (!response.ok) return fallbackDailyStarts;

    const data = await response.json();
    const timings = data?.data?.timings;

    if (timings?.Sunrise && timings?.Asr && timings?.Maghrib && timings?.Isha) {
      return {
        Sunrise: String(timings.Sunrise).slice(0, 5),
        Asr: String(timings.Asr).slice(0, 5),
        Maghrib: String(timings.Maghrib).slice(0, 5),
        Isha: String(timings.Isha).slice(0, 5)
      };
    }

    return fallbackDailyStarts;
  } catch {
    return fallbackDailyStarts;
  }
}

export const getPrayerStarts = unstable_cache(fetchPrayerStartsRaw, ["daily-prayer-starts"], {
  revalidate: 86400
});
