export enum Occasions {
    WorkFromOffice = 1,
    Dates = 2,
    SocialEvents =3,
    ErrandsOrCasual = 4,
    FamilyKids = 5,
    EveningEvents = 6,
    Travel = 7,
}

export function getOccasionName(occasion: Occasions): string {
    switch (occasion) {
        case Occasions.WorkFromOffice:
            return 'Work from Office';
        case Occasions.Dates:
            return 'Dates';
        case Occasions.SocialEvents:
            return 'Social Events';
        case Occasions.ErrandsOrCasual:
            return 'Errands / Casual';
        case Occasions.FamilyKids:
            return 'Family / Kids';
        case Occasions.EveningEvents:
            return 'Evening Events';
        case Occasions.Travel:
            return 'Travel';
        default:
            return 'Unknown';
    }
}