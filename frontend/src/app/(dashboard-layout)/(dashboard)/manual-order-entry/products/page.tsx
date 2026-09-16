import ProductsMainComp from "@/components/modules/products/ProductsMainComp";
import { getUserInfo } from "@/services/auth.service";
import { getProductsData } from "@/services/product.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function ManualOrderProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProductsData(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const userInfo = await getUserInfo()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsMainComp role={userInfo.role}/>
    </HydrationBoundary>
  );
}
