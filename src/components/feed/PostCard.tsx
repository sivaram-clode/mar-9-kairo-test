"use client";

import { useState } from "react";
import Link from "next/link";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: { id: string; name: string; avatar: string | null; headline: string | null };
    _count: { likes: number; comments: number };
    isLiked: boolean;
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [commentCount] = useState(post._count.comments);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const toggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${post.id}/like`, { method });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.count);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card mb-2 overflow-hidden">
      {/* Author header */}
      <div className="flex items-start gap-2 p-4 pb-0">
        <Link href={`/profile/${post.author.id}`} className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-linkedin-blue flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              post.author.name.charAt(0).toUpperCase()
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.author.id}`} className="text-sm font-semibold text-linkedin-text hover:text-linkedin-blue hover:underline">
            {post.author.name}
          </Link>
          {post.author.headline && (
            <p className="text-xs text-linkedin-text-secondary truncate leading-tight">{post.author.headline}</p>
          )}
          <p className="text-xs text-linkedin-text-tertiary">
            {timeAgo(post.createdAt)} • 🌐
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm text-linkedin-text whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="border-t border-linkedin-border">
          <img src={post.imageUrl} alt="Post image" className="w-full max-h-[512px] object-cover" />
        </div>
      )}

      {/* Social counts */}
      {(likeCount > 0 || commentCount > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-linkedin-text-secondary">
          {likeCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-linkedin-blue text-white text-[8px]">👍</span>
              {likeCount}
            </span>
          )}
          {commentCount > 0 && (
            <button onClick={() => setShowComments(!showComments)} className="hover:text-linkedin-blue hover:underline">
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </button>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="px-2 py-1 flex items-center border-t border-linkedin-border">
        <button
          onClick={toggleLike}
          disabled={likeLoading}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded hover:bg-linkedin-bg text-sm font-semibold transition ${
            liked ? "text-linkedin-blue" : "text-linkedin-text-secondary hover:text-linkedin-text"
          }`}
        >
          <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={liked ? 0 : 1.5}>
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
          </svg>
          {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded hover:bg-linkedin-bg text-sm font-semibold text-linkedin-text-secondary hover:text-linkedin-text transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
          Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3 border-t border-linkedin-border">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}
