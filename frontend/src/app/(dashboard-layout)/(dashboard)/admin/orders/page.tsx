import OrderList from '@/components/modules/order/OrderList'
import { getUserInfo } from '@/services/auth.service'
import React from 'react'


export const dynamic = "force-dynamic";

const page = async() => {
  const userInfo = await getUserInfo()
  return (
    <div>
      <OrderList userRole={userInfo.role}/>
    </div>
  )
}

export default page
