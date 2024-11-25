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

const data = {
  profile: {
    name: "Surevenir",
  },
  user: {
    name: "johndoe",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
        {
          title: "Market Reviews",
          url: "/dashboard/markets/reviews",
        },
      ],
    },
    {
      title: "Merchants",
      url: "#",
      icon: HousePlugIcon,
      items: [
        {
          title: "Merchant Details",
          url: "/dashboard/merchants",
        },
        {
          title: "Merchant Reviews",
          url: "/dashboard/merchants/reviews",
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
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Profile profile={data.profile} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
