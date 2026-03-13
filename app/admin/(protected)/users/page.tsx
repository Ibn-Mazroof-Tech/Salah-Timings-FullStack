import { redirect } from "next/navigation";
import AdminUsersClient from "@/app/components/AdminUsersClient";
import { getCurrentUser } from "@/app/lib/auth";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    redirect("/admin/mosques");
  }

  return <AdminUsersClient />;
}
