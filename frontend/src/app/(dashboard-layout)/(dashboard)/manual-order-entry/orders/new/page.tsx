import CreateOrder from "@/components/modules/order/CreateOrder";
import { getProductsData } from "@/services/product.service";

export default async function ManualOrderCreatePage() {
  const response = await getProductsData({ isAvailable: true, limit: 100 });
  const products = response.success ? response.data.data : [];

  return <CreateOrder initialProducts={products} />;
}
