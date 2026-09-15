import ProductsMainComp from "@/components/modules/products/ProductsMainComp";
import { getProductsData } from "@/services/product.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function ManualOrderProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-products"],
    queryFn: getProductsData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsMainComp />
    </HydrationBoundary>
  );
}
