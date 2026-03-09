"use client";

import { useEffect, useState } from "react";

type ConnectionState = "none" | "pending" | "connected" | "self";

export default function ConnectButton({ targetUserId }: { targetUserId: string }) {
  const [state, setState] = useState<ConnectionState>("none");
  const [loading, setLoading] = useState(true);

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
    }
    setLoading(false);
  };

  if (state === "self") return null;

  if (loading) {
    return (
      <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-full text-sm">
        ...
      </button>
    );
  }

  if (state === "connected") {
    return (
      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        ✓ Connected
      </span>
    );
  }

  if (state === "pending") {
    return (
      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
        ⏳ Pending
      </span>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
    >
      + Connect
    </button>
  );
}
