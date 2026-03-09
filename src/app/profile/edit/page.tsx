"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

interface FormSection {
  title: string;
  fields: Array<{ name: string; label: string; placeholder: string }>;
}

const experienceFields: FormSection = {
  title: "Add Experience",
  fields: [
    { name: "title", label: "Title", placeholder: "e.g. Software Engineer" },
    { name: "company", label: "Company", placeholder: "e.g. Acme Corp" },
    { name: "startDate", label: "Start Date", placeholder: "" },
    { name: "endDate", label: "End Date (leave empty if current)", placeholder: "" },
    { name: "description", label: "Description", placeholder: "What did you do?" },
  ],
};

const educationFields: FormSection = {
  title: "Add Education",
  fields: [
    { name: "school", label: "School", placeholder: "e.g. MIT" },
    { name: "degree", label: "Degree", placeholder: "e.g. Bachelor's" },
    { name: "field", label: "Field of Study", placeholder: "e.g. Computer Science" },
    { name: "startDate", label: "Start Date", placeholder: "" },
    { name: "endDate", label: "End Date", placeholder: "" },
  ],
};

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  // Sub-form states
  const [expForm, setExpForm] = useState<Record<string, string>>({});
  const [eduForm, setEduForm] = useState<Record<string, string>>({});
  const [skillName, setSkillName] = useState("");
  const [submitting, setSubmitting] = useState("");

  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then((r) => r.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        });
    }
  }, [userId, status]);

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("exp");
    await fetch(`/api/users/${userId}/experience`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expForm),
    });
    setExpForm({});
    // Refresh
    const res = await fetch(`/api/users/${userId}`);
    setProfile(await res.json());
    setSubmitting("");
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("edu");
    await fetch(`/api/users/${userId}/education`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eduForm),
    });
    setEduForm({});
    const res = await fetch(`/api/users/${userId}`);
    setProfile(await res.json());
    setSubmitting("");
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSubmitting("skill");
    await fetch(`/api/users/${userId}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: skillName }),
    });
    setSkillName("");
    const res = await fetch(`/api/users/${userId}`);
    setProfile(await res.json());
    setSubmitting("");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const renderSubForm = (
    section: FormSection,
    form: Record<string, string>,
    setForm: (v: Record<string, string>) => void,
    onSubmit: (e: React.FormEvent) => void,
    key: string
  ) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        {section.fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            {f.name === "description" ? (
              <textarea
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900"
                placeholder={f.placeholder}
                rows={3}
              />
            ) : f.name.includes("Date") ? (
              <input
                type="date"
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900"
              />
            ) : (
              <input
                type="text"
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900"
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting === key}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting === key ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <button
            onClick={() => router.push(`/profile/${userId}`)}
            className="text-blue-600 hover:underline text-sm"
          >
            View profile →
          </button>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <ProfileEditForm
            userId={userId!}
            initialData={profile as { name: string; headline?: string | null; avatar?: string | null; summary?: string | null; location?: string | null }}
            onSaved={() => router.push(`/profile/${userId}`)}
          />
        </div>

        {/* Experience */}
        {renderSubForm(experienceFields, expForm, setExpForm, handleAddExperience, "exp")}

        {/* Education */}
        {renderSubForm(educationFields, eduForm, setEduForm, handleAddEducation, "edu")}

        {/* Skills */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Skill</h2>
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-gray-900"
              placeholder="e.g. TypeScript"
            />
            <button
              type="submit"
              disabled={submitting === "skill"}
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
