"use client";

import Link from "next/link";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    headline: string | null;
    avatar: string | null;
    location: string | null;
    skills: { id: string; name: string }[];
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      href={`/profile/${user.id}`}
      className="block bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"
    >
      {/* Mini banner */}
      <div className="h-16 bg-gradient-to-r from-[#004182] to-[#0a66c2]" />
      <div className="px-4 pb-4 -mt-6">
        <div className="w-12 h-12 rounded-full bg-linkedin-blue flex items-center justify-center text-white font-semibold text-lg overflow-hidden border-2 border-white mb-2">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user.name[0]?.toUpperCase() ?? "U"
          )}
        </div>
        <h3 className="font-semibold text-sm text-linkedin-text truncate">{user.name}</h3>
        {user.headline && (
          <p className="text-xs text-linkedin-text-secondary truncate mt-0.5">{user.headline}</p>
        )}
        {user.location && (
          <p className="text-xs text-linkedin-text-tertiary mt-0.5">{user.location}</p>
        )}
        {user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {user.skills.slice(0, 3).map((skill) => (
              <span key={skill.id} className="px-2 py-0.5 bg-linkedin-blue-light text-linkedin-blue text-[11px] rounded-full font-medium">
                {skill.name}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="text-[11px] text-linkedin-text-tertiary">+{user.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
