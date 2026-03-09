"use client";

interface ProfileHeaderProps {
  name: string;
  headline?: string | null;
  avatar?: string | null;
  location?: string | null;
  summary?: string | null;
  isOwner: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({
  name,
  headline,
  avatar,
  location,
  summary,
  isOwner,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400" />

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="-mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            {headline && (
              <p className="text-lg text-gray-600 mt-1">{headline}</p>
            )}
            {location && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                📍 {location}
              </p>
            )}
          </div>

          {isOwner && (
            <button
              onClick={onEdit}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 text-sm font-medium"
            >
              Edit profile
            </button>
          )}
        </div>

        {summary && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
