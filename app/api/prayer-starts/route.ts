import { NextResponse } from "next/server";
import { getPrayerStarts } from "@/app/lib/prayer-starts";

export async function GET() {
  const starts = await getPrayerStarts();
  return NextResponse.json(starts);
}
