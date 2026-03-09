"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ExperienceCard from "@/components/profile/ExperienceCard";
import EducationCard from "@/components/profile/EducationCard";
import SkillsList from "@/components/profile/SkillsList";
import ConnectButton from "@/components/connections/ConnectButton";

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

  const userId = params.id as string;
  const isOwner =
    session?.user && (session.user as { id?: string }).id === userId;

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
    await fetch(`/api/users/${userId}/experience?experienceId=${expId}`, {
      method: "DELETE",
    });
    fetchProfile();
  };

  const handleDeleteEducation = async (eduId: string) => {
    await fetch(`/api/users/${userId}/education?educationId=${eduId}`, {
      method: "DELETE",
    });
    fetchProfile();
  };

  const handleDeleteSkill = async (skillId: string) => {
    await fetch(`/api/users/${userId}/skills?skillId=${skillId}`, {
      method: "DELETE",
    });
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
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
          <div className="flex justify-end -mt-2">
            <ConnectButton targetUserId={userId} />
          </div>
        )}

        <ExperienceCard
          experiences={profile.experiences}
          isOwner={!!isOwner}
          onDelete={handleDeleteExperience}
        />

        <EducationCard
          educations={profile.educations}
          isOwner={!!isOwner}
          onDelete={handleDeleteEducation}
        />

        <SkillsList
          skills={profile.skills}
          isOwner={!!isOwner}
          onDelete={handleDeleteSkill}
        />
      </div>
    </div>
  );
}
