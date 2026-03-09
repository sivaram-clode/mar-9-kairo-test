"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import UserCard from "@/components/search/UserCard";
import { SearchSkeleton } from "@/components/ui/Skeleton";

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
      <div className="bg-white rounded-lg shadow-card p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-linkedin-text mb-1">Search for people</h3>
        <p className="text-sm text-linkedin-text-secondary">Use the search bar to find people by name, headline, or skills.</p>
      </div>
    );
  }

  if (loading) return <SearchSkeleton />;

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-12 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-lg font-semibold text-linkedin-text mb-1">No results found</h3>
        <p className="text-sm text-linkedin-text-secondary">No results for &quot;{q}&quot;. Try different keywords.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-linkedin-text-secondary mb-4">
        {users.length} result{users.length !== 1 ? "s" : ""} for &quot;{q}&quot;
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-linkedin-bg">
      <div className="max-w-[1128px] mx-auto px-4 py-6">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
