"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type ParishSelectWithSearchProps = {
  parishes: ParishType[];
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  isInvalid?: boolean;
  isSuccess?: boolean;
  placeholder?: string;
};

const ParishSelectWithSearch = ({
  parishes,
  name,
  value,
  onValueChange,
  isInvalid,
  isSuccess,
  placeholder = "Select a parish",
}: ParishSelectWithSearchProps) => {
  const [parishSearch, setParishSearch] = useState("");

  const normalizedParishSearch = parishSearch.trim().toLowerCase();

  const filteredParishes = useMemo(() => {
    if (!normalizedParishSearch) return parishes;

    return parishes.filter((p) => {
      const parishName = p.parish_name?.toLowerCase?.() ?? String(p.parish_name ?? "");
      const location = p.location?.toLowerCase?.() ?? String(p.location ?? "");
      return (
        parishName.includes(normalizedParishSearch) ||
        location.includes(normalizedParishSearch)
      );
    });
  }, [normalizedParishSearch, parishes]);

  return (
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger isInvalid={isInvalid} isSuccess={isSuccess} className="overflow-x-hidden">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={1}
        className="p-3 w-(--radix-select-trigger-width)"
      >
        <div className="flex flex-col gap-2 px-2">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search parish or location..."
              value={parishSearch}
              onChange={(e) => setParishSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="h-9 w-full rounded-md border border-input-blur bg-[#F7F7F7] pl-8 pr-3 text-sm placeholder:text-gray-400 focus:border-input focus:outline-none"
            />
          </div>
        </div>

        {filteredParishes.map((p) => (
          <SelectItem key={p.parish_id} value={p.parish_id}>
            {p.parish_name}
            {p.location ? ", " + p.location : ""}
          </SelectItem>
        ))}

        {filteredParishes.length === 0 && (
          <p className="py-3 text-center text-sm text-gray-400">No parishes found</p>
        )}
      </SelectContent>
    </Select>
  );
};

export default ParishSelectWithSearch;

