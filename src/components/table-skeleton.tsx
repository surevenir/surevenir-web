"use client";

import { Skeleton } from "./ui/skeleton";

export default function TableSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </div>
    </>
  );
}
