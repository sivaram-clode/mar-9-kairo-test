"use client";

import { useState } from "react";
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
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Author header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            post.author.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{post.author.name}</p>
          {post.author.headline && (
            <p className="text-xs text-gray-500 truncate">{post.author.headline}</p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="px-4 pb-2">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="rounded-lg w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-1 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
        <span>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
        <span>{commentCount} {commentCount === 1 ? "comment" : "comments"}</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center gap-4 border-t border-gray-100">
        <button
          onClick={toggleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1 text-sm font-medium ${
            liked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
        >
          {liked ? "👍" : "👍🏻"} {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          💬 Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}
