export const sacramentKeyMap = {
  HusbandFirstName: "husband_first_name",
  HusbandLastName: "husband_last_name",
  HusbandID: "husband_id",
  WifeFirstName: "wife_first_name",
  WifeLastName: "wife_last_name",
  WifeID: "wife_id",
  DateMarried: "date_married",
  ParishID: "parish_id",
  ParishName: "parish_name",
  OfficiatingPriest: "officiating_priest",
  Witness1: "witness_1",
  Witness2: "witness_2",
};

export interface CreateMatrimonySacramentValues {
  [sacramentKeyMap.HusbandFirstName]: string;
  [sacramentKeyMap.HusbandLastName]: string;
  [sacramentKeyMap.HusbandID]: string;
  [sacramentKeyMap.WifeFirstName]: string;
  [sacramentKeyMap.WifeLastName]: string;
  [sacramentKeyMap.WifeID]: string;
  [sacramentKeyMap.DateMarried]: string;
  [sacramentKeyMap.ParishID]: string;
  [sacramentKeyMap.ParishName]: string;
  [sacramentKeyMap.OfficiatingPriest]: string;
  [sacramentKeyMap.Witness1]: string;
  [sacramentKeyMap.Witness2]: string;
}
