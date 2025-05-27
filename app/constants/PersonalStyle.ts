export enum PersonalStyle {
    Classic = 1,
    Romantic = 2,
    Dramatic =3,
    Natural =4,
    Creative = 5,
    ElegantChic = 6,
    SexyAlluring = 7,
}

export function getPersonalStyleName(personalStyle: PersonalStyle): string {
    switch (personalStyle) {
        case PersonalStyle.Classic:
            return 'Classic';
        case PersonalStyle.Romantic:
            return 'Romantic';
        case PersonalStyle.Dramatic:
            return 'Dramatic';
        case PersonalStyle.Natural:
            return 'Natural';
        case PersonalStyle.Creative:
            return 'Creative';
        case PersonalStyle.ElegantChic:
            return 'Elegant / Chic';
        case PersonalStyle.SexyAlluring:
            return 'Sexy / Alluring';
        default:
            return 'Unknown';
    }
}