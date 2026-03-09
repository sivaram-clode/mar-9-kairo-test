"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import CommentCard from "./CommentCard";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setContent("");
        showToast("Comment added");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-3">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border border-linkedin-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-linkedin-blue placeholder-linkedin-text-tertiary"
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="text-linkedin-blue font-semibold text-sm hover:bg-linkedin-blue-light px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Post
        </button>
      </form>
      {fetching ? (
        <div className="space-y-2">
          <div className="skeleton h-12 w-full rounded" />
          <div className="skeleton h-12 w-full rounded" />
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
