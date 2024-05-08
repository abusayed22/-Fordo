import React from 'react'
import { FcBusiness, FcLibrary } from "react-icons/fc";
import { FaCar } from "react-icons/fa";

function HistoryTable() {
    return (
        <div>


            <div className=' mx-auto'>
                {/* history table  */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800  ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1 bg-green-500 flex justify-center items-center w-8 h-8 rounded-full'>
                                            <FcBusiness size={30}/>
                                        </div>
                                        <p className='text-white'>Travel</p>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    09/09/2012
                                </td>
                                <td className="px-6 py-4">
                                    amr iche moto ami onk tk khoroch kore felsi
                                </td>
                                <td className="px-6 py-4">
                                    $2999
                                </td>
                                <td className="px-6 py-4 ">
                                    Sayed
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800  ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1 bg-green-500 flex justify-center items-center w-8 h-8 rounded-full'>
                                            <FcLibrary size={30}/>
                                        </div>
                                        <p className='text-white'>House Rent</p>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    09/09/2012
                                </td>
                                <td className="px-6 py-4">
                                    amr iche moto ami onk tk khoroch kore felsi
                                </td>
                                <td className="px-6 py-4">
                                    $2999
                                </td>
                                <td className="px-6 py-4 ">
                                    Sayed
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800  ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1 bg-purple-500 flex justify-center items-center w-8 h-8 rounded-full'>
                                            <FaCar size={30}/>
                                        </div>
                                        <p className='text-white'>Car Rent</p>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    09/09/2012
                                </td>
                                <td className="px-6 py-4">
                                    amr iche moto ami onk tk khoroch kore felsi
                                </td>
                                <td className="px-6 py-4">
                                    $2999
                                </td>
                                <td className="px-6 py-4 ">
                                    Sayed
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default HistoryTable
