"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ExperienceCard from "@/components/profile/ExperienceCard";
import EducationCard from "@/components/profile/EducationCard";
import SkillsList from "@/components/profile/SkillsList";
import ConnectButton from "@/components/connections/ConnectButton";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline?: string | null;
  avatar?: string | null;
  summary?: string | null;
  location?: string | null;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
  }>;
  educations: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string | null;
  }>;
  skills: Array<{ id: string; name: string }>;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const userId = params.id as string;
  const isOwner = session?.user && (session.user as { id?: string }).id === userId;

  const fetchProfile = async () => {
    const res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
      setProfile(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleDeleteExperience = async (expId: string) => {
    await fetch(`/api/users/${userId}/experience?experienceId=${expId}`, { method: "DELETE" });
    showToast("Experience removed");
    fetchProfile();
  };

  const handleDeleteEducation = async (eduId: string) => {
    await fetch(`/api/users/${userId}/education?educationId=${eduId}`, { method: "DELETE" });
    showToast("Education removed");
    fetchProfile();
  };

  const handleDeleteSkill = async (skillId: string) => {
    await fetch(`/api/users/${userId}/skills?skillId=${skillId}`, { method: "DELETE" });
    showToast("Skill removed");
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linkedin-bg">
        <div className="max-w-[1128px] mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-linkedin-text mb-1">User not found</h3>
          <p className="text-sm text-linkedin-text-secondary">This profile doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <div className="max-w-[1128px] mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-2">
          <ProfileHeader
            name={profile.name}
            headline={profile.headline}
            avatar={profile.avatar}
            location={profile.location}
            summary={profile.summary}
            isOwner={!!isOwner}
            onEdit={() => router.push("/profile/edit")}
          />

          {!isOwner && session?.user && (
            <div className="flex gap-2">
              <ConnectButton targetUserId={userId} />
            </div>
          )}

          {profile.experiences.length > 0 && (
            <ExperienceCard
              experiences={profile.experiences}
              isOwner={!!isOwner}
              onDelete={handleDeleteExperience}
            />
          )}

          {profile.educations.length > 0 && (
            <EducationCard
              educations={profile.educations}
              isOwner={!!isOwner}
              onDelete={handleDeleteEducation}
            />
          )}

          {profile.skills.length > 0 && (
            <SkillsList
              skills={profile.skills}
              isOwner={!!isOwner}
              onDelete={handleDeleteSkill}
            />
          )}

          {/* Empty states for own profile */}
          {isOwner && profile.experiences.length === 0 && (
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <h3 className="font-semibold text-linkedin-text mb-1">Add experience</h3>
              <p className="text-sm text-linkedin-text-secondary mb-3">Show your work history to build credibility.</p>
              <button onClick={() => router.push("/profile/edit")} className="text-sm font-semibold text-linkedin-blue hover:underline">
                + Add experience
              </button>
            </div>
          )}

          {isOwner && profile.educations.length === 0 && (
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <h3 className="font-semibold text-linkedin-text mb-1">Add education</h3>
              <p className="text-sm text-linkedin-text-secondary mb-3">Highlight your educational background.</p>
              <button onClick={() => router.push("/profile/edit")} className="text-sm font-semibold text-linkedin-blue hover:underline">
                + Add education
              </button>
            </div>
          )}

          {isOwner && profile.skills.length === 0 && (
            <div className="bg-white rounded-lg shadow-card p-6 text-center">
              <h3 className="font-semibold text-linkedin-text mb-1">Add skills</h3>
              <p className="text-sm text-linkedin-text-secondary mb-3">Showcase your expertise to stand out.</p>
              <button onClick={() => router.push("/profile/edit")} className="text-sm font-semibold text-linkedin-blue hover:underline">
                + Add skills
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-card p-4 sticky top-[68px]">
            <h3 className="text-sm font-semibold text-linkedin-text mb-3">People also viewed</h3>
            <p className="text-xs text-linkedin-text-tertiary">No suggestions available</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
