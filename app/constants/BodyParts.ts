export enum BodyParts {
    NeckCollarbone = 1,
    Shoulders = 2,
    Arms = 3,
    Chest = 4,
    Back = 5,
    Waist = 6,
    Stomach = 7,
    Hips = 8,
    Butt = 9,
    Thighs = 10,
    Knees = 11,
    Calves = 12,
    Ankles = 13,
    Feet = 14,
}

export function getBodyPartName(bodyPart: BodyParts): string {
    switch (bodyPart) {
        case BodyParts.NeckCollarbone:
            return 'Neck/Collarbone';
        case BodyParts.Shoulders:
            return 'Shoulders';
        case BodyParts.Arms:
            return 'Arms (Upper Arms)';
        case BodyParts.Chest:
            return 'Bust / Chest';
        case BodyParts.Back:
            return 'Back (Upper/Mid)';
        case BodyParts.Waist:
            return 'Waist';
        case BodyParts.Stomach:
            return 'Tummy / Stomach';
        case BodyParts.Hips:
            return 'Hips';
        case BodyParts.Butt:
            return 'Butt / Rear';
        case BodyParts.Thighs:
            return 'Thighs';
        case BodyParts.Knees:
            return 'Knees';
        case BodyParts.Calves:
            return 'Calves';
        case BodyParts.Ankles:
            return 'Ankles';
        case BodyParts.Feet:
            return 'Feet';
        default:
            return 'Unknown';
    }
}