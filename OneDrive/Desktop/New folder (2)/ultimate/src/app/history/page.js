"use client";
import HistoryTable from "@/components/HistoryTable";
import GenaralLayout from "@/components/layout/GenaralLayout";
import Pagination from "@/components/Pagination";
import React, { useState } from "react";

function page() {
  const [tab, setTab] = useState("");

  return (
    <GenaralLayout>
      <div className="mt-10">
        <div className="w-[90%] mx-auto">
        <ul className="grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-lg p-1">
          <li>
            <a
              href="#page1"
              className={`flex justify-center py-4 ${
                tab === "Name" && "shadow text-indigo-900 bg-white"
              }`}
            >
              Travel
            </a>
          </li>
          <li>
            <a
              href="#page2"
              className="flex justify-center bg-white rounded-lg shadow text-indigo-900 py-4"
            >
              Travel
            </a>
          </li>
          <li>
            <a href="#page3" className="flex justify-center py-4">
            Travel
            </a>
          </li>
          <li>
            <a href="#page4" className="flex justify-center py-4">
            Travel
            </a>
          </li>
          <li>
            <a href="#page5" className="flex justify-center py-4">
            Travel
            </a>
          </li>
        </ul>
        </div>

        <div className="w-[90%] h-[80vh] mx-auto mt-4 flex flex-col justify-between">
          {/* tabs  */}

          <HistoryTable />
          <div className="flex justify-center">
            <Pagination />
          </div>
        </div>
      </div>
    </GenaralLayout>
  );
}

export default page;
