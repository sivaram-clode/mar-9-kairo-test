"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { data: session } = useSession();
  const user = session?.user as { name?: string | null; image?: string | null } | undefined;
  const { showToast } = useToast();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrl: imageUrl || undefined }),
      });

      if (res.ok) {
        setContent("");
        setImageUrl("");
        setExpanded(false);
        onPostCreated();
        showToast("Post created successfully");
      } else {
        showToast("Failed to create post", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card mb-2">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linkedin-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              (user?.name?.[0] ?? "U").toUpperCase()
            )}
          </div>
          <button
            onClick={() => setExpanded(true)}
            className={`flex-1 text-left px-4 py-3 rounded-full border border-linkedin-border text-linkedin-text-secondary text-sm font-medium hover:bg-linkedin-bg transition ${expanded ? "hidden" : ""}`}
          >
            Start a post
          </button>
        </div>

        {expanded && (
          <form onSubmit={handleSubmit} className="mt-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full border-none resize-none focus:outline-none text-sm text-linkedin-text min-h-[120px] placeholder-linkedin-text-tertiary"
              rows={4}
              autoFocus
            />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Add image URL (optional)"
              className="w-full px-3 py-2 text-sm border border-linkedin-border rounded focus:outline-none focus:ring-1 focus:ring-linkedin-blue mb-3"
            />
            <div className="flex items-center justify-between border-t border-linkedin-border pt-3">
              <div className="flex items-center gap-1">
                <button type="button" className="p-2 rounded hover:bg-linkedin-bg text-linkedin-blue" title="Photo">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-4 5h14l-5-6z"/></svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setExpanded(false); setContent(""); setImageUrl(""); }}
                  className="px-4 py-1.5 text-sm font-semibold text-linkedin-text-secondary hover:bg-linkedin-bg rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="px-4 py-1.5 bg-linkedin-blue text-white rounded-full text-sm font-semibold hover:bg-linkedin-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </form>
        )}

        {!expanded && (
          <div className="flex items-center justify-around mt-2 pt-1 border-t border-linkedin-border">
            <button onClick={() => setExpanded(true)} className="flex items-center gap-2 px-3 py-2.5 rounded hover:bg-linkedin-bg text-sm font-semibold text-linkedin-text-secondary">
              <svg className="w-5 h-5 text-[#378fe9]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-4 5h14l-5-6z"/></svg>
              Photo
            </button>
            <button onClick={() => setExpanded(true)} className="flex items-center gap-2 px-3 py-2.5 rounded hover:bg-linkedin-bg text-sm font-semibold text-linkedin-text-secondary">
              <svg className="w-5 h-5 text-[#c37d16]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              Event
            </button>
            <button onClick={() => setExpanded(true)} className="flex items-center gap-2 px-3 py-2.5 rounded hover:bg-linkedin-bg text-sm font-semibold text-linkedin-text-secondary">
              <svg className="w-5 h-5 text-[#e06847]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
              Write article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
