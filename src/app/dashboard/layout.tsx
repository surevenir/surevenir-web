import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";
import { ReactNode } from "react";
import { DashboardDynamicBreadcrumb } from "./DashboardDynamicBreadcrumb";
import { cookies } from "next/headers";
import { getUserById } from "@/utils/userActions";

export const metadata: Metadata = {
  title: "Surevenir | Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const user = (await getUserById(token as string, token as string)) || {};

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 flex items-center gap-2 h-16 transition-[width,height] ease-linear shrink-0">
          <div className="flex justify-between items-center py-4 pr-8 pl-3 w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardDynamicBreadcrumb />
            </div>
            <ModeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
