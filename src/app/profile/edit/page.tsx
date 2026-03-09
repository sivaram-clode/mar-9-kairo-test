"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { useToast } from "@/components/ui/Toast";

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const [expForm, setExpForm] = useState<Record<string, string>>({});
  const [eduForm, setEduForm] = useState<Record<string, string>>({});
  const [skillName, setSkillName] = useState("");
  const [submitting, setSubmitting] = useState("");

  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/signin"); return; }
    if (userId) {
      fetch(`/api/users/${userId}`).then((r) => r.json()).then((data) => { setProfile(data); setLoading(false); });
    }
  }, [userId, status]);

  const refreshProfile = async () => {
    const res = await fetch(`/api/users/${userId}`);
    setProfile(await res.json());
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("exp");
    await fetch(`/api/users/${userId}/experience`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(expForm) });
    setExpForm({});
    await refreshProfile();
    showToast("Experience added");
    setSubmitting("");
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting("edu");
    await fetch(`/api/users/${userId}/education`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(eduForm) });
    setEduForm({});
    await refreshProfile();
    showToast("Education added");
    setSubmitting("");
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSubmitting("skill");
    await fetch(`/api/users/${userId}/skills`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: skillName }) });
    setSkillName("");
    await refreshProfile();
    showToast("Skill added");
    setSubmitting("");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
        <div className="skeleton h-8 w-40" />
      </div>
    );
  }

  const inputClass = "w-full border border-linkedin-border rounded-lg px-3 py-2.5 text-sm text-linkedin-text focus:outline-none focus:ring-2 focus:ring-linkedin-blue focus:border-transparent";

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <div className="max-w-[800px] mx-auto py-6 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-linkedin-text">Edit Profile</h1>
          <button onClick={() => router.push(`/profile/${userId}`)} className="text-linkedin-blue hover:underline text-sm font-semibold">
            View profile →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-base font-semibold text-linkedin-text mb-4">Basic Information</h2>
          <ProfileEditForm
            userId={userId!}
            initialData={profile as { name: string; headline?: string | null; avatar?: string | null; summary?: string | null; location?: string | null }}
            onSaved={() => router.push(`/profile/${userId}`)}
          />
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-base font-semibold text-linkedin-text mb-4">Add Experience</h2>
          <form onSubmit={handleAddExperience} className="space-y-3">
            <input type="text" value={expForm.title || ""} onChange={(e) => setExpForm({ ...expForm, title: e.target.value })} className={inputClass} placeholder="Title (e.g. Software Engineer)" required />
            <input type="text" value={expForm.company || ""} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} className={inputClass} placeholder="Company" required />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={expForm.startDate || ""} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} className={inputClass} required />
              <input type="date" value={expForm.endDate || ""} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} className={inputClass} placeholder="End Date" />
            </div>
            <textarea value={expForm.description || ""} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className={inputClass} placeholder="Description (optional)" rows={3} />
            <button type="submit" disabled={submitting === "exp"} className="px-5 py-2 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition">
              {submitting === "exp" ? "Adding..." : "Add Experience"}
            </button>
          </form>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-base font-semibold text-linkedin-text mb-4">Add Education</h2>
          <form onSubmit={handleAddEducation} className="space-y-3">
            <input type="text" value={eduForm.school || ""} onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })} className={inputClass} placeholder="School" required />
            <input type="text" value={eduForm.degree || ""} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className={inputClass} placeholder="Degree" required />
            <input type="text" value={eduForm.field || ""} onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })} className={inputClass} placeholder="Field of Study" required />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={eduForm.startDate || ""} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })} className={inputClass} required />
              <input type="date" value={eduForm.endDate || ""} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })} className={inputClass} />
            </div>
            <button type="submit" disabled={submitting === "edu"} className="px-5 py-2 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition">
              {submitting === "edu" ? "Adding..." : "Add Education"}
            </button>
          </form>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-base font-semibold text-linkedin-text mb-4">Add Skill</h2>
          <form onSubmit={handleAddSkill} className="flex gap-3">
            <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} className={`flex-1 ${inputClass}`} placeholder="e.g. TypeScript" />
            <button type="submit" disabled={submitting === "skill"} className="px-5 py-2 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 transition whitespace-nowrap">
              {submitting === "skill" ? "Adding..." : "Add Skill"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
