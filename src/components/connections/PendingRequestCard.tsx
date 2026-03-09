"use client";

import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface PendingRequestCardProps {
  connectionId: string;
  requester: {
    id: string;
    name: string;
    headline?: string | null;
    avatar?: string | null;
  };
  onAction: () => void;
}

export default function PendingRequestCard({ connectionId, requester, onAction }: PendingRequestCardProps) {
  const { showToast } = useToast();

  const handleAccept = async () => {
    await fetch(`/api/connections/${connectionId}/accept`, { method: "PUT" });
    showToast(`You and ${requester.name} are now connected`);
    onAction();
  };

  const handleReject = async () => {
    await fetch(`/api/connections/${connectionId}/reject`, { method: "PUT" });
    showToast("Invitation ignored", "info");
    onAction();
  };

  return (
    <div className="flex items-center gap-3 py-3">
      <Link href={`/profile/${requester.id}`} className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-linkedin-blue flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {requester.avatar ? (
            <img src={requester.avatar} alt={requester.name} className="w-full h-full object-cover" />
          ) : (
            requester.name[0].toUpperCase()
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${requester.id}`} className="font-semibold text-sm text-linkedin-text hover:underline">
          {requester.name}
        </Link>
        {requester.headline && (
          <p className="text-xs text-linkedin-text-secondary truncate">{requester.headline}</p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleReject}
          className="px-4 py-1.5 text-sm font-semibold text-linkedin-text-secondary border border-linkedin-border rounded-full hover:bg-linkedin-bg transition"
        >
          Ignore
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-linkedin-blue rounded-full hover:bg-linkedin-blue-hover transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
