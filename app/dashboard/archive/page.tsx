"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import AllSacraments from "./_shared/AllSacraments";
import { ArchiveDialogsProvider } from "./_shared/context/ArchiveDialogsContext";
import CreateSacramentDialog from "./_shared/dialogs/CreateSacramentDialog";

export default function ArchivePage() {
  const [filter, setFilter] = useState("All Parishes");
  return (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Sacramental Records
          </h1>
          <div className="flex w-full gap-10">
            <div className="rounded-lg bg-[#f6f6f6ae] p-5 flex h-full w-full flex-1 ring-1 ring-zinc-200/70">
            </div>
            <button className="flex items-center gap-2.5 rounded-lg bg-purple-700 px-4 py-2 text-white w-max">
              <Plus />
              Add New Record
            </button>
          </div>
          <AllSacraments filter={filter} />
        </div>
       

  );
}

