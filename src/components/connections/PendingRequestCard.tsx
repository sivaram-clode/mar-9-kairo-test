"use client";

import Link from "next/link";

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
  const handleAccept = async () => {
    await fetch(`/api/connections/${connectionId}/accept`, { method: "PUT" });
    onAction();
  };

  const handleReject = async () => {
    await fetch(`/api/connections/${connectionId}/reject`, { method: "PUT" });
    onAction();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
        {requester.avatar ? (
          <img src={requester.avatar} alt={requester.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          requester.name[0]
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${requester.id}`} className="font-semibold text-gray-900 hover:underline">
          {requester.name}
        </Link>
        {requester.headline && (
          <p className="text-sm text-gray-500 truncate">{requester.headline}</p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleAccept}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
