import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-[#c7d9ff]/80">
            Logged in as {user.name} ({user.role})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/mosques" className="px-3 py-2 rounded-lg border border-white/20 text-sm">
            Mosques
          </a>
          {user.role === "ADMIN" ? (
            <a href="/admin/users" className="px-3 py-2 rounded-lg border border-white/20 text-sm">
              Users
            </a>
          ) : null}
          <form action="/api/auth/logout" method="post">
            <button className="rounded-lg bg-[#c7d9ff] text-[#0b1d3a] font-semibold px-4 py-2 text-sm">Logout</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
