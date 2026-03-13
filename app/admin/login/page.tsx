import AdminLoginForm from "@/app/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="glass-card rounded-2xl p-5">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
