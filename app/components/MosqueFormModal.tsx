"use client";

import { FormEvent, useEffect, useState } from "react";
import { MosqueInput, MosqueRecord } from "@/app/types";

const defaults: MosqueInput = {
  name: "",
  location: "",
  image: "",
  zuhrJamaat: "13:30",
  fajrOnFive: 25,
  fajrOffFive: 30,
  asrGap: 30,
  ishaGap: 45,
  maghribGap: 7
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: MosqueRecord | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function MosqueFormModal({ open, mode, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MosqueInput>(defaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && initial) {
      setForm({
        name: initial.name,
        location: initial.location,
        image: initial.image || "",
        zuhrJamaat: initial.zuhrJamaat,
        fajrOnFive: initial.fajrOnFive,
        fajrOffFive: initial.fajrOffFive,
        asrGap: initial.asrGap,
        ishaGap: initial.ishaGap,
        maghribGap: initial.maghribGap
      });
      return;
    }
    setForm(defaults);
  }, [mode, initial, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.location.trim()) {
      setError("Name and location are required.");
      return;
    }

    setLoading(true);
    try {
      const url = mode === "create" ? "/api/mosques" : `/api/mosques/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Save failed");
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 p-4 z-20">
      <div className="max-w-xl mx-auto mt-8 glass-card rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">{mode === "create" ? "Add Mosque Card" : "Edit Mosque Card"}</h2>
          <button onClick={onClose} className="text-sm border border-white/25 rounded-md px-2 py-1" type="button">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              type="text"
              placeholder="Mosque Name"
              className="w-full rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              required
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              type="text"
              placeholder="Location"
              className="w-full rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
          </div>

          <input
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            type="url"
            placeholder="Image URL (optional)"
            className="w-full rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              value={form.zuhrJamaat}
              onChange={(e) => setForm((prev) => ({ ...prev, zuhrJamaat: e.target.value }))}
              type="time"
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              value={form.fajrOnFive}
              onChange={(e) => setForm((prev) => ({ ...prev, fajrOnFive: Number(e.target.value || 0) }))}
              type="number"
              min={0}
              max={60}
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              value={form.fajrOffFive}
              onChange={(e) => setForm((prev) => ({ ...prev, fajrOffFive: Number(e.target.value || 0) }))}
              type="number"
              min={0}
              max={60}
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              value={form.asrGap}
              onChange={(e) => setForm((prev) => ({ ...prev, asrGap: Number(e.target.value || 0) }))}
              type="number"
              min={0}
              max={90}
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              value={form.ishaGap}
              onChange={(e) => setForm((prev) => ({ ...prev, ishaGap: Number(e.target.value || 0) }))}
              type="number"
              min={0}
              max={120}
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
            <input
              value={form.maghribGap}
              onChange={(e) => setForm((prev) => ({ ...prev, maghribGap: Number(e.target.value || 0) }))}
              type="number"
              min={0}
              max={30}
              className="rounded-lg bg-[#10274f]/70 border border-white/10 px-3 py-2 text-sm"
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#e6f0ff] text-[#0b1d3a] font-semibold py-2 disabled:opacity-70"
          >
            {loading ? "Saving..." : mode === "create" ? "Save Mosque" : "Update Mosque"}
          </button>
        </form>
      </div>
    </div>
  );
}
