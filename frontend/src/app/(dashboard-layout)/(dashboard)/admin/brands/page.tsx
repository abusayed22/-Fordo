import BrandMainComp from "@/components/modules/brand/BrandMainComp";
import { getUserInfo } from "@/services/auth.service";
import { getBrandsData } from "@/services/brand.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


export const dynamic = "force-dynamic";


export default async function BrandsPage() {
   const queryClient = new QueryClient();

  const brandResponse = await getBrandsData();
  queryClient.setQueryData(["admin-brands"], brandResponse);

  const userInfo = await getUserInfo();

  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandMainComp role={userInfo.role}/>
    </HydrationBoundary>
  );
}
