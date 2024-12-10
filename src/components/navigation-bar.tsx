"use client";

import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { BorderBeam } from "./ui/border-beam";
import { User } from "@/app/types/types";
import { getUserById } from "@/utils/userActions";
import { usePathname } from "next/navigation";

type Role = "ADMIN" | "USER" | "NOTLOGIN";

export default function NavigationBar() {
  const params = usePathname();
  const navMain = {
    ADMIN: [
      { title: "Markets", url: "/markets" },
      { title: "Merchants", url: "/merchants" },
      { title: "Products", url: "/products" },
      { title: "Predict", url: "/predict" },
      { title: "Profile", url: "/profile" },
      { title: "Dashboard", url: "/dashboard" },
    ],
    USER: [
      { title: "Markets", url: "/markets" },
      { title: "Merchants", url: "/merchants" },
      { title: "Products", url: "/products" },
      { title: "Predict", url: "/predict" },
      { title: "Profile", url: "/profile" },
    ],
    NOTLOGIN: [
      { title: "Markets", url: "/markets" },
      { title: "Merchants", url: "/merchants" },
      { title: "Products", url: "/products" },
      { title: "Predict", url: "/predict" },
    ],
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("NOTLOGIN");
  const [userId, setUserId] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromCookie = Cookies.get("idToken");
    const userIdFromCookie = Cookies.get("userId");

    if (tokenFromCookie && userIdFromCookie) {
      setIsLoggedIn(true);
      setUserId(userIdFromCookie);
      setToken(tokenFromCookie);
    } else {
      setIsLoggedIn(false);
      setRole("NOTLOGIN");
    }
  }, []);

  useEffect(() => {
    if (token && userId) {
      const fetchUserData = async () => {
        const fetchedUser: any = await getUserById(userId, userId);

        if (fetchedUser) {
          setUser(fetchedUser);
          const userRole =
            fetchedUser.role === "ADMIN" || fetchedUser.role === "USER"
              ? fetchedUser.role
              : "NOTLOGIN";
          setRole(userRole);
        } else {
          setRole("NOTLOGIN");
        }
      };

      fetchUserData();
    }
  }, [token, userId]);

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
          <SheetContent side={"left"} className="flex justify-start">
            <SheetHeader>
              <Link href={"/"}>
                <SheetTitle className="flex justify-start md:text-xl">
                  Surevenir
                </SheetTitle>
              </Link>
            </SheetHeader>
            <NavigationMenu className="flex justify-center w-full">
              <NavigationMenuList className="flex flex-col gap-6 md:m-0 -ml-8">
                {navMain[role].map((item) => (
                  <NavigationMenuItem
                    key={item.title}
                    className="flex justify-center bg-transparent w-full"
                  >
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} w-64 md:text-lg`}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                {isLoggedIn ? (
                  <LogoutButton />
                ) : (
                  <Link href={"/auth/login"}>
                    <RainbowButton className="px-4 text-sm">
                      Login
                      <LogInIcon height={15} />
                    </RainbowButton>
                  </Link>
                )}
                <ModeToggle />
              </NavigationMenuList>
            </NavigationMenu>
          </SheetContent>
        </Sheet>
      </div>

      <div className="top-0 right-0 left-0 z-50 fixed lg:flex justify-between items-center hidden bg-white/5 shadow-md backdrop-blur-md px-8 md:px-16 lg:px-32 py-4 w-full">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            width={35}
            height={30}
            alt="Picture of the author"
            className="rounded-md"
          />
          <TypographyLarge>Surevenir</TypographyLarge>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {navMain[role].map((item) => (
              <NavigationMenuItem key={item.title} className="bg-transparent">
                <Link href={item.url} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      params?.includes(item.url)
                        ? "underline-offset-4 underline"
                        : ""
                    }`}
                  >
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
