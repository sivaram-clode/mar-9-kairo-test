"use client";

export function PostSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-card mb-3 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-32" />
          <div className="skeleton h-3 w-48" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
      <div className="skeleton h-px w-full mb-3" />
      <div className="flex gap-4">
        <div className="skeleton h-8 w-20 rounded" />
        <div className="skeleton h-8 w-24 rounded" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="skeleton h-48 w-full rounded-none" />
        <div className="px-6 pb-6">
          <div className="-mt-16 mb-4">
            <div className="skeleton w-32 h-32 rounded-full border-4 border-white" />
          </div>
          <div className="skeleton h-6 w-48 mb-2" />
          <div className="skeleton h-4 w-64 mb-1" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="skeleton h-5 w-24 mb-4" />
        <div className="space-y-3">
          <div className="skeleton h-16 w-full rounded" />
          <div className="skeleton h-16 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

export function ConnectionSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-card p-4 flex items-center gap-4">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-3 w-48" />
      </div>
    </div>
  );
}

export function NetworkSkeleton() {
  return (
    <div className="space-y-3">
      <ConnectionSkeleton />
      <ConnectionSkeleton />
      <ConnectionSkeleton />
      <ConnectionSkeleton />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-start gap-3">
            <div className="skeleton w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-3 w-40" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
