import NavigationBar from "@/components/navigation-bar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  return (
    <>
      <NavigationBar />
      <div className="px-32 py-4 w-full">
        <div className="py-8">
          <Skeleton className="w-full h-[200px]" />
          <p>Product Page</p>
        </div>
      </div>
    </>
  );
}
