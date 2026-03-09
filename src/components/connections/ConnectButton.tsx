"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

type ConnectionState = "none" | "pending" | "connected" | "self";

export default function ConnectButton({ targetUserId }: { targetUserId: string }) {
  const [state, setState] = useState<ConnectionState>("none");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/connections/status?userId=${targetUserId}`)
      .then((r) => r.json())
      .then((data) => {
        setState(data.status as ConnectionState);
        setLoading(false);
      });
  }, [targetUserId]);

  const handleConnect = async () => {
    setLoading(true);
    const res = await fetch("/api/connections/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresseeId: targetUserId }),
    });
    if (res.ok) {
      setState("pending");
      showToast("Connection request sent");
    } else {
      showToast("Failed to send connection request", "error");
    }
    setLoading(false);
  };

  if (state === "self") return null;

  if (loading) {
    return (
      <button disabled className="px-5 py-1.5 bg-linkedin-bg text-linkedin-text-tertiary rounded-full text-sm font-semibold">
        ...
      </button>
    );
  }

  if (state === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-5 py-1.5 border border-linkedin-border text-linkedin-text-secondary rounded-full text-sm font-semibold">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
        Connected
      </span>
    );
  }

  if (state === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-5 py-1.5 border border-linkedin-border text-linkedin-text-secondary rounded-full text-sm font-semibold">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
        Pending
      </span>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover transition"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      Connect
    </button>
  );
}
