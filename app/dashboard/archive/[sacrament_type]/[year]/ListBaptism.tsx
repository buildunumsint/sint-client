"use client";

import { useAuthContext } from "@/context/AuthContext";
import { dateStrokesFull, parseArray } from "@/lib/formatters";
import { createApiClientSecured } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useArchiveDialogs } from "../../_shared/context/ArchiveDialogsContext";

interface ListBaptismPageProps {
    year: string;
}
interface Baptism {
    baptism_id: string;
    user_id: string;
    date_baptized: string;
    parish_id: string;
    parish_name: string;
    baptismal_name: string;
    officiating_priest: string;
    godfather: string;
    godmother: string;
    created_at: string;
    updated_at: string;
    User: {
        user_id: string;
        first_name: string;
        last_name: string;
        username: string;
        Gender: string;
        date_of_birth: string;
        email: string;
        password_hashed: string;
        phone: string | null;
        address: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        UserRoles: string[] | null;
        ParishMemberships: string[] | null;
        StaffPermissions: string[] | null;
    };
    Parish: {
        parish_id: string;
        parish_name: string;
        location: string;
        is_active: boolean;
        priest_in_charge: string;
        contact_number: string;
        email: string;
        created_at: string;
        established_at: string;
        updated_at: string;
    };
}


const ListBaptism = ({ year }: ListBaptismPageProps) => {
    const { access_token, updateAccessToken } = useAuthContext();
    const { createSacrament } = useArchiveDialogs();
    const apiClient = createApiClientSecured(access_token, updateAccessToken, "json");
    const { data, isFetching } = useQuery({
        queryKey: ["sacraments", "baptism", year],
        queryFn: () => apiClient.get(`/sacraments/baptisms?year=${year}`),
        enabled: !!access_token,
    })

    const baptisms: Baptism[] = useMemo(() => {
        if (!data?.status || !data?.data) return [];
        return parseArray(data?.data?.baptisms) as Baptism[];
    }, [data]);

    const Field = ({ label, value }: { label: string; value?: string | null }) => (
        <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 truncate">{value || "------"}</p>
        </div>
    );

    const seeMore = () => {
        createSacrament.onOpenChange(true);
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {isFetching ? (
                <div className="rounded-2xl bg-white px-4 py-4 sm:px-6 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-sm text-zinc-600">Loading baptisms…</p>
                </div>
            ) : null}
            {!isFetching && baptisms.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-4 sm:px-6 shadow-sm ring-1 ring-zinc-200">
                    <p className="text-sm text-zinc-600">No baptism records found for {year}.</p>
                </div>
            ) : null}
            {baptisms.map((baptism) => (
                <div
                    key={baptism.baptism_id}
                    className="w-full rounded-2xl bg-[#F7F7F7] px-4 py-4 sm:px-6 shadow-xs"

                >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
                        <Field
                            label="Full name"
                            value={`${baptism?.User?.first_name ?? ""} ${baptism?.User?.last_name ?? ""}`.trim() || "------"}
                        />
                        <Field label="Baptismal name" value={baptism?.baptismal_name} />
                        <Field label="Date baptized" value={dateStrokesFull(baptism?.date_baptized)} />
                        <Field label="Minister" value={baptism?.officiating_priest} />
                        <Field
                            label="Sponsor"
                            value={[baptism?.godfather, baptism?.godmother].filter(Boolean).join(" & ") || "------"}
                        />

                        <div className="col-span-2 flex items-center justify-end sm:col-span-3 lg:col-span-1">
                            <button
                                type="button"
                                onClick={seeMore}
                                className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                            >
                                See more
                            </button>
                        </div>
                    </div>

                    {/* {expandedId === baptism.baptism_id ? (
                        <div className="mt-4 border-t border-zinc-100 pt-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                                <Field label="Parish" value={baptism?.parish_name || baptism?.Parish?.parish_name} />
                                <Field label="Location" value={baptism?.Parish?.location} />
                                <Field label="Godfather" value={baptism?.godfather} />
                                <Field label="Godmother" value={baptism?.godmother} />
                            </div>
                        </div>
                    ) : null} */}
                </div>
            ))}
        </div>
    )
}

export default ListBaptism;