"use client";

import { createApiClientSecured } from "@/services/apiClient";
import { useAuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { parseArray } from "@/lib/formatters";
import FolderIcon from "@/app/dashboard/_shared/icons/FolderIcon";
import { useRouter } from "next/navigation";

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
    const [sacramentsYears, setSacramentsYears] = useState<UserSacramentYears[]>([]);
    const setAccessToken = (token: string) => {
        updateValues({ access_token: token });
    };
    const apiClient = createApiClientSecured(access_token, setAccessToken);

    const { data, isFetching } = useQuery({
        queryKey: ["sacraments_years", sacrament_type],
        queryFn: () => apiClient.get(`sacraments/years?sacrament=${sacrament_type}`),
        enabled: !!access_token,
    })
    useEffect(() => {
        if (data?.status && data?.data) {
            setSacramentsYears(parseArray(data?.data));
        }
    }, [data, isFetching]);

    const goToSacramentRecords = (year: string) => {
        router.push(`/dashboard/archive/${sacrament_type}/${year}`);
    }
    return (
        <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 my-10">{
                sacrament_type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sacramentsYears.map((s) => (
                    <div key={s.year} className="flex flex-col gap-2 items-center w-max">
                        <button onClick={() => goToSacramentRecords(s.year)}>
                            <FolderIcon/>
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