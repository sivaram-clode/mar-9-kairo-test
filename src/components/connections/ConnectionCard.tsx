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
    <div className="flex items-center gap-3 py-3">
      <Link href={`/profile/${user.id}`} className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-linkedin-blue flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name[0].toUpperCase()
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.id}`} className="font-semibold text-sm text-linkedin-text hover:underline">
          {user.name}
        </Link>
        {user.headline && (
          <p className="text-xs text-linkedin-text-secondary truncate">{user.headline}</p>
        )}
      </div>
      <Link
        href={`/profile/${user.id}`}
        className="px-4 py-1.5 text-sm font-semibold text-linkedin-text-secondary border border-linkedin-border rounded-full hover:bg-linkedin-bg hover:border-linkedin-text-secondary transition"
      >
        Message
      </Link>
    </div>
  );
}
