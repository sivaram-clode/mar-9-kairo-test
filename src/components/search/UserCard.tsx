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
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-medium text-lg overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user.name[0]?.toUpperCase() ?? "U"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          {user.headline && (
            <p className="text-sm text-gray-600 truncate">{user.headline}</p>
          )}
          {user.location && (
            <p className="text-xs text-gray-400 mt-0.5">{user.location}</p>
          )}
          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
