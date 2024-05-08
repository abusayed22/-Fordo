import DashBoradCard from '@/components/DashBoradCard'
import HistoryTable from '@/components/HistoryTable'
import GenaralLayout from '@/components/layout/GenaralLayout'
import React from 'react'

function page() {
  return (
    <GenaralLayout>
      <div className='w-[90%] md:w-[80%] mx-auto'>
        <DashBoradCard />
        <div className='mt-10 flex flex-col '>
          <p className='underline p-1'>Recent Expense</p>
          <div className=''></div>
        <HistoryTable />
        </div>
      </div>
    </GenaralLayout>
  )
}

export default page
