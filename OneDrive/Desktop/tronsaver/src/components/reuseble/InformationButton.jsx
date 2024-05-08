"use client"
import {FaEthereum} from "react-icons/fa";

export const InformationButton = () => {
    return (
        <>
            <button
                className="relative border hover:text-green duration-500 group cursor-pointer  overflow-hidden h-[40px] w-[40px] rounded-md bg-yellow-500 p-2 flex justify-center items-center font-extrabold">
                <div
                    className="absolute z-10 w-[35px] h-[35px]  rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-neutral-900 delay-150 group-hover:delay-75"></div>
                <div
                    className="absolute z-10 w-[30px] h-[35px]  rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-neutral-800 delay-150 group-hover:delay-100"></div>
                <div
                    className="absolute z-10 w-[25px] h-[35px]  rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-neutral-700 delay-150 group-hover:delay-150"></div>
                <div
                    className="absolute z-10 w-[20px] h-[35px]  rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-neutral-600 delay-150 group-hover:delay-200"></div>
                <div
                    className="absolute z-10 w-[15px] h-[35px]  rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-neutral-500 delay-150 group-hover:delay-300"></div>
                    <p className="z-10">
                    <FaEthereum color='yellow' size={20}/>
                    </p>
            </button>
        </>
    )
}