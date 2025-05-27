export enum Height {
    Petite = 1,
    Regular = 2,
    Tall = 3,
}

export function getHeightName(height: Height): string {
    switch (height) {
        case Height.Petite:
            return 'Petite';
        case Height.Regular:
            return 'Regular';
        case Height.Tall:
            return 'Tall';
        default:
            return 'Unknown';
    }
}

