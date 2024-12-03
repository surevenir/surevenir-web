"use server";

import { getUsers } from "@/utils/userActions";
import { cookies } from "next/headers";
import DashboardUserView from "./DashboardUserView";

export default async function DashboardProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const users = (await getUsers(token as string)) || [];

  return (
    <>
      <DashboardUserView users={users} />
    </>
  );
}
