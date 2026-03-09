"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConnectionCard from "@/components/connections/ConnectionCard";
import PendingRequestCard from "@/components/connections/PendingRequestCard";
import { NetworkSkeleton } from "@/components/ui/Skeleton";

interface ConnectionUser {
  id: string;
  name: string;
  headline?: string | null;
  avatar?: string | null;
}

interface ConnectionItem {
  connectionId: string;
  user: ConnectionUser;
}

interface PendingItem {
  id: string;
  requester: ConnectionUser;
}

export default function NetworkPage() {
  const { status } = useSession();
  const router = useRouter();
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [connRes, pendRes] = await Promise.all([
      fetch("/api/connections"),
      fetch("/api/connections/pending"),
    ]);
    if (connRes.ok) setConnections(await connRes.json());
    if (pendRes.ok) setPending(await pendRes.json());
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linkedin-bg">
        <div className="max-w-[1128px] mx-auto py-6 px-4">
          <div className="skeleton h-8 w-40 mb-6" />
          <NetworkSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <div className="max-w-[1128px] mx-auto py-6 px-4 space-y-4">
        {pending.length > 0 && (
          <div className="bg-white rounded-lg shadow-card p-5">
            <h2 className="text-base font-semibold text-linkedin-text mb-4">
              Invitations ({pending.length})
            </h2>
            <div className="divide-y divide-linkedin-border">
              {pending.map((p) => (
                <PendingRequestCard
                  key={p.id}
                  connectionId={p.id}
                  requester={p.requester}
                  onAction={fetchData}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-card p-5">
          <h2 className="text-base font-semibold text-linkedin-text mb-4">
            Connections ({connections.length})
          </h2>
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-linkedin-text mb-1">No connections yet</h3>
              <p className="text-sm text-linkedin-text-secondary">
                Search for people you know and send them a connection request.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-linkedin-border">
              {connections.map((c) => (
                <ConnectionCard key={c.connectionId} user={c.user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
