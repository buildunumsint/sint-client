"use client";

import { useRouter } from "next/navigation";
import FolderIcon from "../../_shared/icons/FolderIcon";
import { useSacramentsTypeContext } from "@/context/prefetch/SacramentTypesContext";

interface Sacraments {
    filter: string;
}


const AllSacraments = ({ filter }: Sacraments) => {
    const { sacrament_types } = useSacramentsTypeContext();
    const router = useRouter();
    const goToSacramentRecords = (sacrament_type: string) => {
        router.push(`/dashboard/archive/${sacrament_type}`);
    }
    return (
        <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 my-10">{
                filter}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sacrament_types.map((s) => (
                    <div key={s.sacrament_type} className="flex flex-col gap-2 items-center w-max">
                        <button onClick={() => goToSacramentRecords(s.sacrament_type)}>
                            <FolderIcon />
                        </button>
                        <div className="flex flex-col gap-1 items-center">
                            <h3 className="text-lg tracking-tight text-zinc-900">{s.sacrament_type}</h3>
                            <p className="text-sm text-zinc-500">{s?.count ? s?.count + " " + "files" : "No files"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default AllSacraments;