"use client";

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null };
  };
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-2 py-2">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
        {comment.user.avatar ? (
          <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          comment.user.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
        <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
        <p className="text-sm text-gray-700">{comment.content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
