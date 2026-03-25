"use client";

import { Input } from "@/components/ui/input";
import { useParishesContext } from "@/context/prefetch/ParishesContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ARCHIVE_QUERY_NAME,
  ARCHIVE_QUERY_PARISH,
} from "../hooks/useArchiveFilters";
import ParishIcon from "@/app/dashboard/_shared/icons/ParishIcon";
import SearchIcon from "@/app/dashboard/_shared/icons/SearchIcon";
import { useArchiveDialogs } from "../context/ArchiveDialogsContext";

const ALL_PARISHES = "__all__";
const NAME_DEBOUNCE_MS = 300;

function ArchiveSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { parishes } = useParishesContext();
  const { createParish } = useArchiveDialogs();

  const nameFromUrl = searchParams.get(ARCHIVE_QUERY_NAME) ?? "";
  const [draftName, setDraftName] = useState(nameFromUrl);

  useEffect(() => {
    setDraftName(nameFromUrl);
  }, [nameFromUrl]);

  useEffect(() => {
    const urlName = searchParams.get(ARCHIVE_QUERY_NAME) ?? "";
    const t = setTimeout(() => {
      if (draftName === urlName) return;
      const next = new URLSearchParams(searchParams.toString());
      if (draftName) next.set(ARCHIVE_QUERY_NAME, draftName);
      else next.delete(ARCHIVE_QUERY_NAME);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, NAME_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [draftName, pathname, router, searchParams]);

  const replaceQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const [parishSearch, setParishSearch] = useState("");

  const parishValue = searchParams.get(ARCHIVE_QUERY_PARISH) ?? ALL_PARISHES;
  const normalizedParishSearch = parishSearch.trim().toLowerCase();
  const filteredParishes = normalizedParishSearch
    ? parishes.filter(
        (p) =>
          p.parish_name.toLowerCase().includes(normalizedParishSearch) ||
          p.location.toLowerCase().includes(normalizedParishSearch),
      )
    : parishes;

  const onParishChange = (value: string) => {
    replaceQuery((params) => {
      if (!value || value === ALL_PARISHES) params.delete(ARCHIVE_QUERY_PARISH);
      else params.set(ARCHIVE_QUERY_PARISH, value);
    });
  };

  return (
    <div className="flex w-full items-center justify-between gap-5">
      <Input
        startContent={<SearchIcon />}
        placeholder="Search by name"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        className="placeholder:text-gray-400"
      />

      <Select value={parishValue} onValueChange={onParishChange}>
        <SelectTrigger icon={<ParishIcon />} className="text-gray-400">
          <SelectValue placeholder="Select a parish" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={8}
          className="p-3 w-(--radix-select-trigger-width)"
        >
          <div className="flex flex-col gap-2 px-2">
            <button
              type="button"
              onClick={() => createParish.onOpenChange(true)}
              className="mb-2 flex w-full items-center gap-2.5 rounded-lg bg-primary px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" />
              Add Parish
            </button>
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
          <SelectItem value={ALL_PARISHES}>All Parishes</SelectItem>
          {filteredParishes.map((p) => (
            <SelectItem key={p.parish_id} value={p.parish_id}>
              {p.parish_name}{p.location ? ", " + p.location : ""}
            </SelectItem>
          ))}
          {filteredParishes.length === 0 && (
            <p className="py-3 text-center text-sm text-gray-400">
              No parishes found
            </p>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ArchiveSearchBar;
