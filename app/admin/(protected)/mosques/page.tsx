import { getCurrentUser } from "@/app/lib/auth";
import AdminMosquesClient from "@/app/components/AdminMosquesClient";

export default async function AdminMosquesPage() {
  const user = await getCurrentUser();
  const canDelete = user?.role === "ADMIN";

  return <AdminMosquesClient canDelete={canDelete} />;
}
