"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface StoreSettings {
  id?: string;
  manual_closed: boolean;
  closure_starts_at: string | null;
  closure_ends_at: string | null;
  closure_reason: string | null;
}

function toLocalDatetime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminStoreStatusPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/store-status")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/store-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setMessage("Settings saved");
    } else {
      setMessage("Failed to save");
    }

    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1D3C42]">Store Status</h1>
        <p className="text-sm text-[#7A6262]">Manually control whether orders are accepted</p>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold ${
          message === "Settings saved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-[#F4CFC8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#D4AF37]" />
              <div>
                <p className="font-bold text-[#1D3C42]">Manual Closure</p>
                <p className="text-xs text-[#7A6262]">
                  {settings?.manual_closed
                    ? "Orders are manually closed"
                    : "Orders are accepting based on schedule"}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setSettings((s) =>
                  s ? { ...s, manual_closed: !s.manual_closed } : s
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                settings?.manual_closed ? "bg-red-400" : "bg-green-400"
              }`}
            >
              <span
                className={`absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow transition ${
                  settings?.manual_closed ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {settings?.manual_closed && (
          <div className="rounded-2xl border border-[#F4CFC8] bg-white p-6 space-y-4">
            <h2 className="font-bold text-[#1D3C42]">Closure Period</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Starts at</label>
                <input
                  type="datetime-local"
                  value={toLocalDatetime(settings?.closure_starts_at ?? null)}
                  onChange={(e) =>
                    setSettings((s) =>
                      s ? { ...s, closure_starts_at: e.target.value ? new Date(e.target.value).toISOString() : null } : s
                    )
                  }
                  className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Ends at</label>
                <input
                  type="datetime-local"
                  value={toLocalDatetime(settings?.closure_ends_at ?? null)}
                  onChange={(e) =>
                    setSettings((s) =>
                      s ? { ...s, closure_ends_at: e.target.value ? new Date(e.target.value).toISOString() : null } : s
                    )
                  }
                  className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#7A6262]">Reason (optional)</label>
              <input
                type="text"
                value={settings?.closure_reason ?? ""}
                onChange={(e) =>
                  setSettings((s) => (s ? { ...s, closure_reason: e.target.value } : s))
                }
                className="w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]"
                placeholder="e.g. Holiday, maintenance..."
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#1D3C42] px-10 py-4 font-bold text-white transition hover:bg-[#163136] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
