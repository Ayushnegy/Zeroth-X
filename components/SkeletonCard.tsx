export default function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-[220px] animate-pulse">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="w-3/4 h-6 bg-secondaryBg rounded-md" />
          <div className="w-16 h-6 bg-secondaryBg rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-secondaryBg rounded-full" />
          <div className="w-32 h-4 bg-secondaryBg rounded-md" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="w-16 h-6 bg-secondaryBg rounded" />
          <div className="w-20 h-6 bg-secondaryBg rounded" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
        <div className="w-24 h-4 bg-secondaryBg rounded" />
        <div className="w-6 h-6 bg-secondaryBg rounded" />
      </div>
    </div>
  );
}
