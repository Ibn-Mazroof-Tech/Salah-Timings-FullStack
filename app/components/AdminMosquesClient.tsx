"use client";

import { useEffect, useState } from "react";
import MosqueFormModal from "@/app/components/MosqueFormModal";
import { MosqueRecord } from "@/app/types";

type Props = {
  canDelete: boolean;
};

export default function AdminMosquesClient({ canDelete }: Props) {
  const [mosques, setMosques] = useState<MosqueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<MosqueRecord | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/mosques?page=1&pageSize=200", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load mosques");
      const payload = await response.json();
      setMosques(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this mosque?")) return;
    const response = await fetch(`/api/mosques/${id}`, { method: "DELETE" });
    if (!response.ok) {
      alert("Delete failed");
      return;
    }
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Mosques</h2>
        <button
          onClick={() => {
            setMode("create");
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-lg bg-[#c7d9ff] text-[#0b1d3a] font-semibold px-4 py-2 text-sm"
        >
          + Add Mosque
        </button>
      </div>

      {loading ? <div className="glass-card rounded-xl p-4 text-sm">Loading...</div> : null}
      {error ? <div className="glass-card rounded-xl p-4 text-sm text-red-300">{error}</div> : null}

      <div className="grid grid-cols-1 gap-3">
        {mosques.map((mosque) => (
          <div key={mosque.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{mosque.name}</h3>
              <p className="text-sm text-[#c7d9ff]/80">{mosque.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode("edit");
                  setEditing(mosque);
                  setOpen(true);
                }}
                className="px-3 py-1 rounded-md border border-white/20 text-sm"
              >
                Edit
              </button>
              {canDelete ? (
                <button
                  onClick={() => void handleDelete(mosque.id)}
                  className="px-3 py-1 rounded-md border border-red-300/40 text-sm text-red-200"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <MosqueFormModal open={open} mode={mode} initial={editing} onClose={() => setOpen(false)} onSaved={load} />
    </div>
  );
}
