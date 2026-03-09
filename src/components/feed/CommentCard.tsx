"use client";

import Link from "next/link";

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null };
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-2 py-2">
      <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-linkedin-blue flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            comment.user.name.charAt(0).toUpperCase()
          )}
        </div>
      </Link>
      <div className="bg-[#f2f2f2] rounded-lg px-3 py-2 flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${comment.user.id}`} className="text-xs font-semibold text-linkedin-text hover:text-linkedin-blue hover:underline">
            {comment.user.name}
          </Link>
          <span className="text-[11px] text-linkedin-text-tertiary">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-linkedin-text mt-0.5">{comment.content}</p>
      </div>
    </div>
  );
}
