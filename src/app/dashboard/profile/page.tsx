"use server";

import { getUserById } from "@/utils/userActions";
import DashboardProfileView from "./DashboardProfileView";
import { cookies } from "next/headers";

export default async function DashboardProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;

  const user = await getUserById(token as string, token as string);
  return (
    <>
      <div className="px-8">
        <DashboardProfileView user={user} />
      </div>
    </>
  );
}
