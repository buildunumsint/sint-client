import ListBaptism from "./ListBaptism";
import ListConfirmation from "./ListConfirmation";
import ListHolyEucharist from "./ListHolyEucharist";
import ListHolyOrders from "./ListHolyOrders";
import ListMatrimony from "./ListMatrimony";

interface PageProps {
  params: Promise<{
    sacrament_type: string;
    year: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { sacrament_type, year } = await params;
  switch (sacrament_type) {
    case "baptism":
      return <ListBaptism year={year} />;
    case "confirmation":
      return <ListConfirmation year={year} />;
    case "holy_eucharist":
      return <ListHolyEucharist year={year} />;
    case "holy_orders":
    case "holy_order":
      return <ListHolyOrders year={year} />;
    case "matrimony":
      return <ListMatrimony year={year} />;
    default:
      return <div>No sacrament type found</div>;
  }
};

export default Page;