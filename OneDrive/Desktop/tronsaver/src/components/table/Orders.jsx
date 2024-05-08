import "../../assets/order.css"
import {InformationButton} from "@/components/reuseble/InformationButton";
import {ImPower} from "react-icons/im";
import {Progress} from "@/components/reuseble/Progress";
import {SellButton} from "@/components/reuseble/SellButton";

export const Orders = () => {
    return (<div className="order_table">
        <div className=" p-8 rounded-md w-full">
            <div className=" text-center justify-between pb-6 text-secondary text-xl text-yellow-400">
                ORDERS
            </div>
            <div>
                <div className=" sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                            <tr>
                                <th className="px-5 py-7 text-left  text-xs font-semibold uppercase tracking-wider">

                                </th>
                                <th className="px-5 py-7 text-left text-xs text-secondary font-semibold  uppercase tracking-wider">
                                    Resource
                                </th>
                                <th className="px-5 py-7 text-left text-xs text-secondary font-semibold  uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-5 py-7 text-left text-xs text-secondary font-semibold  uppercase tracking-wider">
                                    Payout
                                </th>
                                <th className="px-5 py-7 text-left text-xs text-secondary font-semibold  uppercase tracking-wider">
                                    Fullfiled
                                </th>
                                <th className="px-5 py-7 text-left text-xs font-semibold  uppercase tracking-wider">

                                </th>
                            </tr>

                            </thead>
                            <tbody>
                            <tr>
                                <td className="px-5 py-5 text-sm backdrop-blur-lg bg-gray-700 bg-opacity-30">
                                    <InformationButton />
                                </td>
                                <td className="px-5 py-5 text-primary backdrop-blur-lg bg-gray-700 bg-opacity-30 text-sm">
                                                <div className="flex justify-center items-center space-x-1">
                                                    <p>6,0000</p>
                                                    <ImPower />
                                                </div>
                                        <span className="text-[10px] flex justify-center text-basic">
                                            /29 days
                                        </span>
                                </td>
                                <td className="px-5 py-5 text-sm backdrop-blur-lg bg-gray-700 bg-opacity-30" >
                                    <div className="flex justify-center items-center space-x-1 text-basic">
                                        <p className="text-secondary">58</p>
                                        <p>sun</p>
                                    </div>
                                    <span className="text-[10px] flex justify-center text-basic">
                                        24.16% APY
                                        </span>
                                </td>
                                <td className="px-5 py-5 text-sm backdrop-blur-lg bg-gray-700 bg-opacity-30">
                                    <div className="flex justify-center items-center space-x-1 text-basic">
                                        <p className="text-secondary">70,644 </p>
                                        <p className="text-yellow-400">TRX</p>
                                    </div>
                                    <span className="text-[10px] flex justify-center text-basic">
                                        24.16% APY
                                        </span>
                                </td>
                                <td className="px-5 py-5 text-sm backdrop-blur-lg bg-gray-700 bg-opacity-30">
                                    <Progress pro={"45"} />
                                </td>
                                <td className="px-5 py-5 text-sm backdrop-blur-lg bg-gray-700 bg-opacity-30">
                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span
                      aria-hidden=""
                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                  />
                  <span className="relative">
                      <SellButton text={"Sell"} />
                  </span>
                </span>
                                </td>
                            </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>)
}