"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConnectionCard from "@/components/connections/ConnectionCard";
import PendingRequestCard from "@/components/connections/PendingRequestCard";

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
  const { data: session, status } = useSession();
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading network...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Network</h1>

        {pending.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Pending Requests ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((p) => (
                <PendingRequestCard
                  key={p.id}
                  connectionId={p.id}
                  requester={p.requester}
                  onAction={fetchData}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Connections ({connections.length})
          </h2>
          {connections.length === 0 ? (
            <p className="text-gray-500">No connections yet.</p>
          ) : (
            <div className="space-y-3">
              {connections.map((c) => (
                <ConnectionCard key={c.connectionId} user={c.user} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
