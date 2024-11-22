"use client";

import * as React from "react";

export function Profile({
  profile,
}: {
  profile: {
    name: string;
  };
}) {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex justify-center items-center bg-sidebar-primary rounded-lg text-sidebar-primary-foreground overflow-hidden aspect-square size-6">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="flex-1 items-center grid text-left text-sm leading-tight">
          <span className="font-semibold truncate">{profile.name}</span>
        </div>
      </div>
    </>
  );
}
