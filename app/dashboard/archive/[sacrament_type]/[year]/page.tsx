import ListBaptism from "./ListBaptism";

interface PageProps {
    params: Promise<{
        sacrament_type: string;
        year: string;
    }>
}
const Page = async ({ params }: PageProps) => {
    const { sacrament_type, year } = await (params);
    switch (sacrament_type) {
        case "baptism":
            return <ListBaptism year={year} />;
        default:
            return <div>No sacrament type found</div>;
    }
}

export default Page;