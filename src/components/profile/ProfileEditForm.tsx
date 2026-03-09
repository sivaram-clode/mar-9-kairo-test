"use client";

import { useState } from "react";

interface ProfileEditFormProps {
  userId: string;
  initialData: {
    name: string;
    headline?: string | null;
    avatar?: string | null;
    summary?: string | null;
    location?: string | null;
  };
  onSaved: () => void;
}

export default function ProfileEditForm({
  userId,
  initialData,
  onSaved,
}: ProfileEditFormProps) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    headline: initialData.headline || "",
    avatar: initialData.avatar || "",
    summary: initialData.summary || "",
    location: initialData.location || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline
        </label>
        <input
          type="text"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
          placeholder="e.g. Senior Software Engineer at Acme"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar URL
        </label>
        <input
          type="url"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About
        </label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-gray-900"
          rows={4}
          placeholder="Tell people about yourself..."
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
