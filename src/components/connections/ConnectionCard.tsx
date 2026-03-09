"use client";

import Link from "next/link";

interface ConnectionCardProps {
  user: {
    id: string;
    name: string;
    headline?: string | null;
    avatar?: string | null;
  };
}

export default function ConnectionCard({ user }: ConnectionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          user.name[0]
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.id}`} className="font-semibold text-gray-900 hover:underline">
          {user.name}
        </Link>
        {user.headline && (
          <p className="text-sm text-gray-500 truncate">{user.headline}</p>
        )}
      </div>
    </div>
  );
}
