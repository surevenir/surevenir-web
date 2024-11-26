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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { TypographyLarge } from "@/components/ui/typography";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LogoutButton } from "./logout-button";
import { LogInIcon, MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ShinyButton from "./ui/shiny-button";
import { BorderBeam } from "./ui/border-beam";

export default function NavigationBar() {
  const navMain = [
    {
      title: "Markets",
      url: "/markets",
    },
    {
      title: "Merchants",
      url: "/merchants",
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("idToken");
    console.log(token);

    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="top-4 right-4 z-50 fixed">
            <div className="relative flex justify-center items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-md">
              <MenuIcon width={20} height={20} />
              <p>Menu</p>
              <BorderBeam duration={10} delay={7} size={100} />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="top-0 z-50 sticky lg:flex justify-between items-center hidden bg-white/5 shadow-md backdrop-blur-md px-8 md:px-16 lg:px-32 py-4">
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
              <NavigationMenuItem key={item.title} className="bg-transparent">
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
