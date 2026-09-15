import Link from "next/link";
import { mockOrders } from "@/lib/mock-data";
import OrdersList from "@/components/modules/order/OrderList";
import { getUserInfo } from "@/services/auth.service";

export default async function ManualOrderOrdersPage() {
  const userInfo = await getUserInfo();
  return (
  <div>
    <OrdersList userRole={userInfo.role}/>
  </div>
  );
}
