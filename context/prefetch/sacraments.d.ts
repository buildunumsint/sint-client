type SacramentType =
  | "baptism"
  | "confirmation"
  | "holy_eucharist"
  | "holy_order"
  | "holy_orders"
  | "matrimony";
type SacramentsType = {
  sacrament_type: SacramentType;
  description: string;
  count: number;
  created_at: string;
  updated_at: string;
};
