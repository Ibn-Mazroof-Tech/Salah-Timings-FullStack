import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Mosque Jama'at Times",
  description: "Jama'at timings for New Delhi mosques"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="night-overlay">{children}</body>
    </html>
  );
}
