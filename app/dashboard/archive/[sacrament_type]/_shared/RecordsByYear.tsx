"use client";

import { createApiClientSecured } from "@/services/apiClient";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { parseArray } from "@/lib/formatters";
import FolderIcon from "@/app/dashboard/_shared/icons/FolderIcon";
import { useRouter } from "next/navigation";
import { useArchiveFilters } from "../../_shared/hooks/useArchiveFilters";
import TitleHeader from "../../_shared/TitleHeader";
import { sacramentNameFromType } from "@/context/prefetch/SacramentTypesContext";
import AddRecordButton from "../../_shared/ buttons/AddRecordButton";
import ArchiveSearchBar from "../../_shared/header/ArchiveSearchBar";

interface RecordsByYearProps {
    sacrament_type: string;
}

type UserSacramentYears = {
    year: string;
    total: number;
}

const RecordsByYear = ({ sacrament_type }: RecordsByYearProps) => {
    const router = useRouter();
    const { access_token, updateValues } = useAuthContext();
    const {name, parishId} = useArchiveFilters()
    const [sacramentsYears, setSacramentsYears] = useState<UserSacramentYears[]>([]);
    const setAccessToken = (token: string) => {
        updateValues({ access_token: token });
    };
    const apiClient = createApiClientSecured(access_token, setAccessToken);

    const { data, isFetching } = useQuery({
        queryKey: ["sacraments_years", sacrament_type, name, parishId],
        queryFn: () => apiClient.get(`sacraments/years?sacrament=${sacrament_type}&name=${name}&parish=${parishId}`),
        enabled: !!access_token,
    })
    useEffect(() => {
        if (data?.status && data?.data) {
            setSacramentsYears(parseArray(data?.data));
        }
    }, [data, isFetching]);

    const goToSacramentRecords = (year: string) => {
        router.push(`/dashboard/archive/${sacrament_type}/${year}?name=${name}&parish=${parishId}`);
    }
    return (
        <div className="space-y-10">

            <TitleHeader title={sacramentNameFromType(sacrament_type as SacramentType)}>
                <div className="flex w-full gap-10">
                    <ArchiveSearchBar />
                    <AddRecordButton sacramentType={sacrament_type as SacramentType} />
                </div>
            </TitleHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sacramentsYears.map((s) => (
                    <div key={s.year} className="flex flex-col gap-2 items-center w-max">
                        <button onClick={() => goToSacramentRecords(s.year)}>
                            <FolderIcon />
                        </button>
                        <div className="flex flex-col gap-1 items-center">
                            <h3 className="text-lg tracking-tight text-zinc-900">{s.year}</h3>
                            <p className="text-sm text-zinc-500">{s?.total ? s?.total + " " + "files" : "No files"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default RecordsByYear;