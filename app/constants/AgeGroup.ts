export enum AgeGroup {
    Age18To24 = 1,
    Age25To34 = 2,
    Age35To44 = 3,
    Age45To54 = 4,
    Age55To64 = 5,
}

export function getAgeGroupName(ageGroup: AgeGroup): string {
    switch (ageGroup) {
        case AgeGroup.Age18To24:
            return '18 - 24';
        case AgeGroup.Age25To34:
            return '25 - 34';
        case AgeGroup.Age35To44:
            return '35 - 44';
        case AgeGroup.Age45To54:
            return '45 - 54';
        case AgeGroup.Age55To64:
            return '55 - 64';
        default:
            return 'Unknown';
    }
}