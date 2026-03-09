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
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Banner */}
      <div className="h-[200px] bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#378fe9] relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="-mt-[68px] mb-3">
          <div className="w-[152px] h-[152px] rounded-full border-4 border-white bg-linkedin-bg flex items-center justify-center text-5xl font-bold text-linkedin-text-tertiary overflow-hidden shadow-md">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold text-linkedin-text">{name}</h1>
            {headline && (
              <p className="text-base text-linkedin-text-secondary mt-0.5">{headline}</p>
            )}
            {location && (
              <p className="text-sm text-linkedin-text-tertiary mt-1">{location}</p>
            )}
          </div>

          {isOwner && (
            <button
              onClick={onEdit}
              className="px-5 py-1.5 border-2 border-linkedin-blue text-linkedin-blue rounded-full hover:bg-linkedin-blue-light text-sm font-semibold transition flex-shrink-0"
            >
              Edit profile
            </button>
          )}
        </div>

        {summary && (
          <div className="mt-5 pt-5 border-t border-linkedin-border">
            <h2 className="text-lg font-semibold text-linkedin-text mb-2">About</h2>
            <p className="text-sm text-linkedin-text-secondary whitespace-pre-line leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
