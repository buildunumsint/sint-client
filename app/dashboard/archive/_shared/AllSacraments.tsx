"use client";

import { useRouter } from "next/navigation";
import FolderIcon from "../../_shared/icons/FolderIcon";
import { sacramentNameFromType, useSacramentTypesContext } from "@/context/prefetch/SacramentTypesContext";

interface Sacraments {
    filter: string;
}


const AllSacraments = ({ filter }: Sacraments) => {
    const { sacramentTypes } = useSacramentTypesContext();
    const router = useRouter();
    const goToSacramentRecords = (sacrament_type: string) => {
        router.push(`/dashboard/archive/${sacrament_type}`);
    }
    return (
        <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 mb-10">{
                filter}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                {sacramentTypes.map((s) => (
                    <div key={s.sacrament_type} className="flex flex-col gap-2 items-center w-max">
                        <button onClick={() => goToSacramentRecords(s.sacrament_type)}>
                            <FolderIcon />
                        </button>
                        <div className="flex flex-col gap-1 items-center">
                            <h3 className="text-lg tracking-tight text-zinc-900">{sacramentNameFromType(s.sacrament_type as SacramentType)}</h3>
                            <p className="text-sm text-zinc-500">{s?.count ? s?.count + " " + "files" : "No files"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default AllSacraments;