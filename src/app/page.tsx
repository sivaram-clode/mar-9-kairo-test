"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CreatePostForm from "@/components/feed/CreatePostForm";
import PostCard from "@/components/feed/PostCard";
import { FeedSkeleton } from "@/components/ui/Skeleton";

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null; headline: string | null };
  _count: { likes: number; comments: number };
  isLiked: boolean;
}

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchPosts = useCallback(async (cursor?: string) => {
    const isMore = !!cursor;
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const url = cursor ? `/api/posts?cursor=${cursor}` : "/api/posts";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (isMore) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setNextCursor(data.nextCursor);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, fetchPosts]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedin-bg">
      <div className="max-w-[1128px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Feed */}
        <div>
          <CreatePostForm onPostCreated={() => fetchPosts()} />

          {loading ? (
            <FeedSkeleton />
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-linkedin-text mb-2">No posts yet</h3>
              <p className="text-linkedin-text-secondary text-sm">
                Create a post or connect with others to see their updates here.
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {nextCursor && (
                <div className="text-center py-4">
                  <button
                    onClick={() => fetchPosts(nextCursor)}
                    disabled={loadingMore}
                    className="text-linkedin-blue font-semibold text-sm hover:text-linkedin-blue-hover disabled:opacity-50"
                  >
                    {loadingMore ? "Loading..." : "Load more posts"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-card p-4 sticky top-[68px]">
            <h3 className="text-sm font-semibold text-linkedin-text mb-3">LinkedIn News</h3>
            <ul className="space-y-3">
              {["Tech hiring rebounds in Q1", "Remote work policies evolve", "AI skills in high demand", "Startup funding picks up"].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-linkedin-text-tertiary text-xs mt-0.5">•</span>
                  <div>
                    <p className="text-xs font-semibold text-linkedin-text leading-tight">{item}</p>
                    <p className="text-[11px] text-linkedin-text-tertiary">1d ago • 1,234 readers</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
