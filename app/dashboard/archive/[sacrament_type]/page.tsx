import RecordsByYear from './_shared/RecordsByYear';

interface PageProps {
    params: Promise<{
        sacrament_type: string;
    }>
}
const Page = async ({ params }: PageProps) => {
    const { sacrament_type } = await (params);
    return (
        <div>
            <RecordsByYear sacrament_type={sacrament_type} />
        </div>
    )
}

export default Page