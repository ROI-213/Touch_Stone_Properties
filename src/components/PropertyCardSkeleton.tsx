import { motion } from "framer-motion";

interface PropertyCardSkeletonProps {
  view?: "grid" | "list";
}

export function PropertyCardSkeleton({ view = "grid" }: PropertyCardSkeletonProps) {
  const isList = view === "list";

  return (
    <article
      className={`group flex h-full flex-col justify-between overflow-hidden rounded-[14px] bg-card shadow-card ${
        isList ? "flex-col sm:flex-row" : ""
      }`}
    >
      {/* Image Skeleton */}
      <div
        className={`relative overflow-hidden bg-sand/60 animate-pulse ${
          isList ? "h-[180px] sm:h-auto sm:w-[280px] sm:flex-shrink-0" : "h-[150px] sm:h-[220px] md:h-[250px]"
        }`}
      >
        <div className="absolute left-2 top-2 h-4 w-16 rounded-full bg-charcoal/10 sm:left-3 sm:top-3 sm:h-5 sm:w-20" />
        <div className="absolute right-2 top-2 h-7 w-16 rounded-full bg-charcoal/10 sm:right-3 sm:top-3 sm:h-9 sm:w-20" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Body Skeleton */}
      <div className={`flex flex-1 flex-col justify-between p-3 sm:p-5 ${isList ? "flex-1" : ""}`}>
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded bg-sand sm:h-4 sm:w-32" />
          <div className="mt-2 h-5 w-3/4 rounded bg-sand sm:mt-3 sm:h-6" />
          <div className="mt-2 h-3 w-1/2 rounded bg-sand sm:mt-3 sm:h-4" />
          
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            <div className="h-4 w-16 rounded-full bg-sand sm:h-6 sm:w-20" />
            <div className="h-4 w-16 rounded-full bg-sand sm:h-6 sm:w-20" />
            <div className="h-4 w-20 rounded-full bg-sand sm:h-6 sm:w-24" />
          </div>

          <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
            <div className="h-3 w-full rounded bg-sand" />
            <div className="h-3 w-4/5 rounded bg-sand" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-charcoal/5 pt-2 sm:mt-4 sm:pt-3">
          <div className="h-4 w-16 rounded bg-sand animate-pulse sm:h-5 sm:w-20" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-sand animate-pulse sm:h-8 sm:w-24" />
            <div className="h-6 w-16 rounded-full bg-sand animate-pulse sm:h-8 sm:w-20" />
          </div>
        </div>
      </div>
    </article>
  );
}
