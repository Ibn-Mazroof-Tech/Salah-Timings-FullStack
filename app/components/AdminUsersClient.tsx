"use client";

import { useEffect, useState } from "react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  createdAt: string;
};

export default function AdminUsersClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load users");
      const payload = await response.json();
      setUsers(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateRole(id: string, role: "ADMIN" | "EDITOR") {
    const response = await fetch(`/api/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      alert("Role update failed");
      return;
    }

    void load();
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!response.ok) {
      alert("Delete failed");
      return;
    }
    void load();
  }

  async function createUser() {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      alert(payload?.error || "User create failed");
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    void load();
  }

  if (loading) return <div className="glass-card rounded-xl p-4 text-sm">Loading users...</div>;
  if (error) return <div className="glass-card rounded-xl p-4 text-sm text-red-300">{error}</div>;

  return (
    <div className="space-y-3">
      <div className="glass-card rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-md bg-[#10274f]/70 border border-white/10 px-2 py-1 text-sm"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md bg-[#10274f]/70 border border-white/10 px-2 py-1 text-sm"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="rounded-md bg-[#10274f]/70 border border-white/10 px-2 py-1 text-sm"
        />
        <button
          onClick={() => void createUser()}
          className="rounded-md bg-[#c7d9ff] text-[#0b1d3a] px-3 py-1 text-sm font-semibold"
        >
          Add User
        </button>
      </div>
      {users.map((user) => (
        <div key={user.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-[#c7d9ff]/80">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={user.role}
              onChange={(e) => void updateRole(user.id, e.target.value as "ADMIN" | "EDITOR")}
              className="rounded-md bg-[#10274f]/70 border border-white/10 px-2 py-1 text-sm"
            >
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              onClick={() => void deleteUser(user.id)}
              className="px-3 py-1 rounded-md border border-red-300/40 text-sm text-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
