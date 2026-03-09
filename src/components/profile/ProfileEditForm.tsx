"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

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

export default function ProfileEditForm({ userId, initialData, onSaved }: ProfileEditFormProps) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    headline: initialData.headline || "",
    avatar: initialData.avatar || "",
    summary: initialData.summary || "",
    location: initialData.location || "",
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Profile updated successfully");
        onSaved();
      } else {
        showToast("Failed to update profile", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
        { key: "headline", label: "Headline", type: "text", placeholder: "e.g. Senior Software Engineer at Acme" },
        { key: "location", label: "Location", type: "text", placeholder: "e.g. San Francisco, CA" },
        { key: "avatar", label: "Avatar URL", type: "url", placeholder: "https://example.com/avatar.jpg" },
      ].map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-semibold text-linkedin-text mb-1.5">{field.label}</label>
          <input
            type={field.type}
            value={form[field.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            className="w-full border border-linkedin-border rounded-lg px-3 py-2.5 text-sm text-linkedin-text focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold text-linkedin-text mb-1.5">About</label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="w-full border border-linkedin-border rounded-lg px-3 py-2.5 text-sm text-linkedin-text focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
          rows={4}
          placeholder="Tell people about yourself..."
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
