"use server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictView from "./PredictView";
import HistoriesView from "./HistoriesView";
import { cookies } from "next/headers";
import { getHistories } from "@/utils/predictActions";
import { Histories } from "../types/types";

export default async function PredictPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const histories = (await getHistories(token as string)) || [];

  const sortedHistories: Histories[] = histories.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <div className="px-8 md:px-16 lg:px-32 py-28 w-full">
        <Tabs defaultValue="predict" className="">
          <div className="flex justify-center">
            <TabsList className="m-auto">
              <TabsTrigger value="predict">Predict</TabsTrigger>
              <TabsTrigger value="histories">Histories</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="predict">
            <PredictView />
          </TabsContent>
          <TabsContent value="histories" className="pt-4">
            <HistoriesView histories={sortedHistories} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
