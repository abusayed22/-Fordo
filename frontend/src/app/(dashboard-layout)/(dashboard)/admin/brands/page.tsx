import BrandMainComp from "@/components/modules/brand/BrandMainComp";
import { getBrandsData } from "@/services/brand.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";



export default async function BrandsPage() {
   const queryClient = new QueryClient();

  const brandResponse = await getBrandsData();
  queryClient.setQueryData(["admin-brands"], brandResponse);


  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandMainComp />
    </HydrationBoundary>
  );
}
