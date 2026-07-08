export const SURAH_VERSE_COUNTS: number[] = [
    0, // placeholder for 0-index
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, // 1-10
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135, // 11-20
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,   // 21-30
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,      // 31-40
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,       // 41-50
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,       // 51-60
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,       // 61-70
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,       // 71-80
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20,       // 81-90
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11,            // 91-100
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3,                // 101-110
    5, 4, 5, 6                                    // 111-114
];

/**
 * Gets the maximum verse count for a given Surah number
 */
export function getSurahMaxVerses(surah: number): number {
    if (surah < 1 || surah > 114) return 0;
    return SURAH_VERSE_COUNTS[surah];
}

/**
 * Validates an Ayah reference in the format "Surah:Ayah" (e.g., "2:255")
 */
export function validateAyahReference(ref: string): boolean {
    const pattern = /^\d{1,3}:\d{1,3}$/;
    if (!pattern.test(ref)) return false;

    const [surah, ayah] = ref.split(':').map(Number);

    // Validate Surah number (1-114)
    if (surah < 1 || surah > 114) return false;

    // Validate Ayah exists within the official range of the Surah
    const max = SURAH_VERSE_COUNTS[surah];
    if (ayah < 1 || ayah > max) return false;

    return true;
}

/**
 * Validates Para number (1-30)
 */
export function validateParaNumber(para: number): boolean {
    return Number.isInteger(para) && para >= 1 && para <= 30;
}

/**
 * Calculates total mistakes from ayat mistakes array
 */
export function calculateTotalMistakes(
    ayatMistakes: Array<{ ayah: string; mistakes: number }>
): number {
    return ayatMistakes.reduce((total, item) => total + item.mistakes, 0);
}

/**
 * Validates that all required fields for a learning type are present
 */
export function validateLearningTypeFields(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (data.learningType) {
        case 'qaida':
            if (!data.qaidaLessonNumber) errors.push('Lesson number is required for Qaida');
            if (!data.qaidaPageNumber) errors.push('Page number is required for Qaida');
            if (!data.qaidaTopic) errors.push('Topic is required for Qaida');
            if (data.qaidaMistakesCount === undefined) errors.push('Mistakes count is required for Qaida');
            break;

        case 'nazra':
            if (!data.nazraParaNumber) errors.push('Para number is required for Nazra');
            if (!data.nazraFromAyah) errors.push('From Ayah is required for Nazra');
            if (!data.nazraToAyah) errors.push('To Ayah is required for Nazra');
            if (data.nazraMistakesCount === undefined) errors.push('Mistakes count is required for Nazra');

            // Validate ayah references
            if (data.nazraFromAyah && !validateAyahReference(data.nazraFromAyah)) {
                errors.push('Invalid From Ayah reference format');
            }
            if (data.nazraToAyah && !validateAyahReference(data.nazraToAyah)) {
                errors.push('Invalid To Ayah reference format');
            }
            break;

        case 'hifz':
            if (!data.hifzSabaq) errors.push('Sabaq is required for Hifz');
            if (!data.hifzSabqi) errors.push('Sabqi is required for Hifz');
            if (!data.hifzManzil) errors.push('Manzil is required for Hifz');
            if (!data.hifzAyatMistakes || data.hifzAyatMistakes.length === 0) {
                errors.push('At least one ayat mistake entry is required for Hifz');
            }

            // Validate each ayat reference in mistakes
            if (data.hifzAyatMistakes) {
                data.hifzAyatMistakes.forEach((item: any, index: number) => {
                    if (!validateAyahReference(item.ayah)) {
                        errors.push(`Invalid ayah reference at index ${index}`);
                    }
                });
            }
            break;
    }

    return { valid: errors.length === 0, errors };
}
