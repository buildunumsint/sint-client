"use client";

import { useAuthContext } from "@/context/AuthContext";
import { dateStrokesFull, parseArray } from "@/lib/formatters";
import { createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useArchiveDialogs } from "../../_shared/context/ArchiveDialogsContext";
import TitleHeader from "../../_shared/TitleHeader";
import AddRecordButton from "../../_shared/ buttons/AddRecordButton";
import ArchiveSearchBar from "../../_shared/header/ArchiveSearchBar";
import { useArchiveFilters } from "../../_shared/hooks/useArchiveFilters";

interface ListMatrimonyPageProps {
  year: string;
}

const ListMatrimony = ({ year }: ListMatrimonyPageProps) => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { editSacrament } = useArchiveDialogs();
  const { name, parishId } = useArchiveFilters();
  const apiClient = createApiClientSecured(
    access_token,
    updateAccessToken,
    "json"
  );
  const { data, isFetching } = useQuery({
    queryKey: ["sacraments", "matrimony", year, name, parishId],
    queryFn: () => apiClient.get(`/sacraments/matrimonies?year=${year}&name=${name}&parish=${parishId}`),
    enabled: !!access_token,
  });

  const records: Matrimony[] = useMemo(() => {
    if (!data?.status || !data?.data) return [];
    return parseArray(data?.data?.matrimonies) as Matrimony[];
  }, [data]);

  const Field = ({
    label,
    value,
  }: {
    label: string;
    value?: string | null;
  }) => (
    <div className="min-w-0">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900 truncate">
        {value || "------"}
      </p>
    </div>
  );

  const seeMore = (record: Matrimony) => {
    editSacrament.onOpenChange(true, "matrimony", record);
  };

  return (
    <div className="space-y-10">
      <TitleHeader title={`Matrimony - ${year}`}>
        <div className="flex w-full gap-10">
          <ArchiveSearchBar />
          <AddRecordButton sacramentType="matrimony" />
        </div>
      </TitleHeader>
      <div className="flex flex-col gap-4 w-full">
        {isFetching ? (
          <div className="rounded-2xl bg-white px-4 py-4 sm:px-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-600">Loading records…</p>
          </div>
        ) : null}
        {!isFetching && records.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-4 sm:px-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-600">
              No matrimony records found for {year}.
            </p>
          </div>
        ) : null}
        {records.map((record) => (
          <div
            key={record.matrimony_id}
            className="w-full rounded-2xl bg-[#F7F7F7] px-4 py-4 sm:px-6 shadow-xs"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
              <Field
                label="Husband"
                value={
                  `${record?.husband_first_name ?? ""} ${record?.husband_last_name ?? ""}`.trim() ||
                  "------"
                }
              />
              <Field
                label="Wife"
                value={
                  `${record?.wife_first_name ?? ""} ${record?.wife_last_name ?? ""}`.trim() ||
                  "------"
                }
              />
              <Field
                label="Date married"
                value={dateStrokesFull(record?.date_married)}
              />
              <Field label="Officiating priest" value={record?.officiating_priest} />
              <div className="col-span-2 flex items-center justify-end sm:col-span-3 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => seeMore(record)}
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  See more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListMatrimony;
