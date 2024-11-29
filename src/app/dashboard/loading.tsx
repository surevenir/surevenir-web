"use client";

import { LoaderComponent } from "@/components/loader";
import { TypographyMuted } from "@/components/ui/typography";

export default function DashboardLoadingPage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 w-full h-[100vh]">
        <TypographyMuted>Loading</TypographyMuted>
        <LoaderComponent />
      </div>
    </>
  );
}
