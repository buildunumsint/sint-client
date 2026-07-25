
export const sacramentKeyMap = {
    DateBaptized: "date_baptized",
    ParishID: "parish_id",
    ParishName: "parish_name",
    RecipientFirstName: "recipient_first_name",
    RecipientLastName: "recipient_last_name",
    FatherFullName: "father_full_name",
    MotherFullName: "mother_full_name",
    BaptismalName: "baptismal_name",
    OfficiatingPriest: "officiating_priest",
    GodParent: "god_parent",
    Gender: "gender",
    DateOfBirth: "date_of_birth",
};

export interface CreateBaptismSacramentValues {
    [sacramentKeyMap.DateBaptized]: Date | undefined;
    [sacramentKeyMap.ParishID]: string;
    [sacramentKeyMap.ParishName]: string;
    [sacramentKeyMap.RecipientFirstName]: string;
    [sacramentKeyMap.RecipientLastName]: string;
    [sacramentKeyMap.BaptismalName]: string;
    [sacramentKeyMap.OfficiatingPriest]: string;
    [sacramentKeyMap.GodParent]: string;
    [sacramentKeyMap.FatherFullName]: string;
    [sacramentKeyMap.MotherFullName]: string;
}