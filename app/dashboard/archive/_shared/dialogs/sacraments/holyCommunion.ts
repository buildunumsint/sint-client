export const sacramentKeyMap = {
  RecipientFirstName: "recipient_first_name",
  RecipientLastName: "recipient_last_name",
  DateReceived: "date_received",
  ParishID: "parish_id",
  ParishName: "parish_name",
  OfficiatingPriest: "officiating_priest",
  Sponsor: "sponsor",
};

export interface CreateHolyCommunionSacramentValues {
  [sacramentKeyMap.RecipientFirstName]: string;
  [sacramentKeyMap.RecipientLastName]: string;
  [sacramentKeyMap.DateReceived]: string;
  [sacramentKeyMap.ParishID]: string;
  [sacramentKeyMap.ParishName]: string;
  [sacramentKeyMap.OfficiatingPriest]: string;
  [sacramentKeyMap.Sponsor]: string;
}
