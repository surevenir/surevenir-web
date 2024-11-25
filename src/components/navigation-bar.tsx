"use client";

import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { TypographyLarge } from "@/components/ui/typography";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LogoutButton } from "./logout-button";
import { LogInIcon } from "lucide-react";

interface NavigationBarProps {
  isLoggedIn?: boolean;
}

export default function NavigationBar({
  isLoggedIn = false,
}: NavigationBarProps) {
  const navMain = [
    {
      title: "Markets",
      url: "/markets",
    },
    {
      title: "Products",
      url: "/products",
    },
    {
      title: "Predict",
      url: "/predict",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={35}
            height={30}
            alt="Picture of the author"
            className="rounded-md"
          />
          <TypographyLarge>Surevenir</TypographyLarge>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {navMain.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link href={item.url} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoggedIn ? (
            <>
              <LogoutButton />
            </>
          ) : (
            <Link href={"/auth/login"}>
              <RainbowButton className="px-4 text-sm">
                Login
                <LogInIcon height={15} />
              </RainbowButton>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
