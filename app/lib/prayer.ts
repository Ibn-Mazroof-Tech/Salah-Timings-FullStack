export type DailyStarts = {
  Sunrise: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export const fallbackDailyStarts: DailyStarts = {
  Sunrise: "06:40",
  Asr: "16:30",
  Maghrib: "18:15",
  Isha: "19:30"
};

export function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function to12Hour(totalMinutes: number) {
  const mins = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function quarterBucketJamaat(startTime: string, gapMinutes: number) {
  const start = toMinutes(startTime);
  const bucket = Math.floor(start / 15) * 15;
  return bucket + gapMinutes;
}

export function fajrJamaatFromSunrise(sunrise: string, onFiveOffset: number, offFiveOffset: number) {
  const sunriseMins = toMinutes(sunrise);
  const minute = sunriseMins % 60;
  const roundedUp5 = Math.ceil(sunriseMins / 5) * 5;
  const offset = minute % 5 === 0 ? onFiveOffset : offFiveOffset;
  return roundedUp5 - offset;
}

export function getTimingsForMosque(
  m: {
    zuhrJamaat: string;
    fajrOnFive: number;
    fajrOffFive: number;
    asrGap: number;
    ishaGap: number;
    maghribGap: number;
  },
  dailyStarts: DailyStarts
) {
  return {
    Fajr: fajrJamaatFromSunrise(dailyStarts.Sunrise, Number(m.fajrOnFive), Number(m.fajrOffFive)),
    Zuhr: toMinutes(m.zuhrJamaat),
    Asr: quarterBucketJamaat(dailyStarts.Asr, Number(m.asrGap)),
    Maghrib: toMinutes(dailyStarts.Maghrib) + Number(m.maghribGap),
    Isha: quarterBucketJamaat(dailyStarts.Isha, Number(m.ishaGap))
  };
}

export function upcomingSalahLabel(timings: Record<string, number>) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const order = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];
  for (const salah of order) {
    if (timings[salah] >= current) return salah;
  }
  return "Fajr";
}
