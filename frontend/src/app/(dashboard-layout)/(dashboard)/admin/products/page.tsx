"use server";
import ProductsMainComp from "@/components/modules/products/ProductsMainComp";
import { getProductsData } from "@/services/product.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";


export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ["admin-products"],
    queryFn: getProductsData,
    staleTime: 30 * 1000, // 30 seconds - data stays fresh if this data is accessed again within 30 seconds, it will use the cached data instead of making a new request
    gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time, after this time the cached data will be removed from memory if it's not used
  });
 
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsMainComp />
    </HydrationBoundary>
  );
}
