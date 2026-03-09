"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import UserCard from "@/components/search/UserCard";

interface UserResult {
  id: string;
  name: string;
  headline: string | null;
  avatar: string | null;
  location: string | null;
  skills: { id: string; name: string }[];
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || !session) return;
    setLoading(true);
    fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [q, session]);

  if (!q) {
    return (
      <div className="text-center py-16 text-gray-500">
        Enter a search term to find people.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">Searching…</div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No results found for &quot;{q}&quot;
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {users.length} result{users.length !== 1 ? "s" : ""} for &quot;{q}&quot;
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>
      <Suspense fallback={<div className="text-center py-16 text-gray-500">Loading…</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
