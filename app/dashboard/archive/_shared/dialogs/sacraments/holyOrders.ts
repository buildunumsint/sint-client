export const sacramentKeyMap = {
  RecipientFirstName: "recipient_first_name",
  RecipientLastName: "recipient_last_name",
  OrdinationDate: "ordination_date",
  ParishID: "parish_id",
  ParishName: "parish_name",
  OrdinationLevel: "ordination_level",
  OrdainingBishop: "ordaining_bishop",
};

export interface CreateHolyOrdersSacramentValues {
  [sacramentKeyMap.RecipientFirstName]: string;
  [sacramentKeyMap.RecipientLastName]: string;
  [sacramentKeyMap.OrdinationDate]: string;
  [sacramentKeyMap.ParishID]: string;
  [sacramentKeyMap.ParishName]: string;
  [sacramentKeyMap.OrdinationLevel]: string;
  [sacramentKeyMap.OrdainingBishop]: string;
}
