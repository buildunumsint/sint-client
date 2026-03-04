export const sacramentKeyMap = {
  RecipientFirstName: "recipient_first_name",
  RecipientLastName: "recipient_last_name",
  DateConfirmed: "date_confirmed",
  ParishID: "parish_id",
  ParishName: "parish_name",
  ConfirmationName: "confirmation_name",
  Sponsor: "sponsor",
  OfficiatingBishop: "officiating_bishop",
};

export interface CreateConfirmationSacramentValues {
  [sacramentKeyMap.RecipientFirstName]: string;
  [sacramentKeyMap.RecipientLastName]: string;
  [sacramentKeyMap.DateConfirmed]: string;
  [sacramentKeyMap.ParishID]: string;
  [sacramentKeyMap.ParishName]: string;
  [sacramentKeyMap.ConfirmationName]: string;
  [sacramentKeyMap.Sponsor]: string;
  [sacramentKeyMap.OfficiatingBishop]: string;
}
