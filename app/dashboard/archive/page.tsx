"use client";

import { useState } from "react";
import AllSacraments from "./_shared/AllSacraments";
import TitleHeader from "./_shared/TitleHeader";
import AddRecordButton from "./_shared/ buttons/AddRecordButton";

export default function ArchivePage() {
  const [filter, setFilter] = useState("All Parishes");
  return (
    <div className="space-y-10">
      <TitleHeader title="Sacramental Records">
        <div className="flex w-full gap-10">
          <div className="rounded-lg bg-[#f6f6f6ae] p-5 flex h-full w-full flex-1 ring-1 ring-zinc-200/70">
          </div>
          <AddRecordButton sacramentType={null} />
        </div>
      </TitleHeader>
      <AllSacraments filter={filter} />
    </div>


  );
}

