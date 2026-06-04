const SkeletonCard = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Banner skeleton */}
      <div className="skeleton h-40 w-full" />

      {/* Body skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default SkeletonCard;
