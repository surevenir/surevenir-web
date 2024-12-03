"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardProfileSkeleton() {
  return (
    <>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 py-4">
        <div className="">
          <FormSkeleton />
          <FormSkeleton />
          <FormSkeleton />
          <FormSkeleton />
          <div className="flex flex-row gap-4 py-4 w-full">
            <Skeleton className="rounded-full w-20 h-20" />
            <FormSkeleton />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    </>
  );
}

function FormSkeleton() {
  return (
    <>
      <div className="space-y-2 py-2 w-full">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-10" />
      </div>
    </>
  );
}
