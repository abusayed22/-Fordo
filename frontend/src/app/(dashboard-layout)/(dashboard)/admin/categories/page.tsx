import React from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCategoriesData } from '@/services/categories.service';
import CategoriesMainCom from '@/components/modules/categories/CategoriesMainCom';

async function page(
  {searchParams}:{
    searchParams: Promise<{[key:string]:string | string[] | undefined}>
  }
) {
  const searchParamsObject = await searchParams;
  
   const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-dashboar-dData"],
    queryFn: getCategoriesData,
    staleTime: 30 * 1000, // 30 seconds - data stays fresh if this data is accessed again within 30 seconds, it will use the cached data instead of making a new request
    gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time, after this time the cached data will be removed from memory if it's not used
  });

  
  // if the dashbaord data use this server side rendering
  // const dashboardData = queryClient.getQueryData(["admin-dashboard-data"]) as ApiResponse<IAdminDashboardData>;
  

  return (
      <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesMainCom />
    </HydrationBoundary>
  )
}

export default page
