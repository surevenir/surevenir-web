"use client";

import { useEffect, useState } from "react";
import NavigationBar from "@/components/navigation-bar";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("idToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <div className="px-32 py-4 w-full">
        <NavigationBar isLoggedIn={isLoggedIn} />

        <div className="py-8">
          {isLoggedIn ? (
            <p>Welcome back! You are logged in.</p>
          ) : (
            <>
              <Skeleton className="w-full h-[200px]" />
              <p>Please log in to access more features.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
