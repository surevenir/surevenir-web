"use client";

import * as React from "react";
import {
  Frame,
  Map,
  PieChart,
  Settings2,
  LayoutDashboardIcon,
  MapPinHouseIcon,
  ShoppingBasketIcon,
  HousePlugIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Profile } from "@/components/sidebar-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import Cookies from "js-cookie";
import { getUserById } from "@/utils/userActions";
import { User } from "@/app/types/types";

const data = {
  profile: {
    name: "Surevenir",
  },
  user: {
    name: "johndoe",
    email: "m@example.com",
    avatar: "/logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Markets",
      url: "/dashboard/markets",
      icon: MapPinHouseIcon,
      items: [
        {
          title: "Market Details",
          url: "/dashboard/markets",
        },
      ],
    },
    {
      title: "Merchants",
      url: "/dashboard/merchants",
      icon: HousePlugIcon,
      items: [
        {
          title: "Merchant Details",
          url: "/dashboard/merchants",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: ShoppingBasketIcon,
      items: [
        {
          title: "Product Details",
          url: "/dashboard/products",
        },
        {
          title: "Product Categories",
          url: "/dashboard/products/categories",
        },
        {
          title: "Product Reviews",
          url: "/dashboard/products/reviews",
        },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersIcon,
      items: [
        {
          title: "User Details",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/profile",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User>();
  // const token = Cookies.get("idToken");
  const userId = Cookies.get("userId") || "";
  const fetchUser = async () => {
    const user: any = (await getUserById(userId, userId as string)) || [];
    setUser(user);
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Profile profile={data.profile} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
