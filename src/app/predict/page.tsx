"use server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictView from "./PredictView";
import HistoriesView from "./HistoriesView";

export default async function PredictPage() {
  return (
    <>
      <div className="px-8 md:px-16 lg:px-32 py-20 lg:py-8 w-full">
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
            <HistoriesView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
