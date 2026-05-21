/**
 * Validates an Ayah reference in the format "Surah:Ayah" (e.g., "2:255")
 */
export function validateAyahReference(ref: string): boolean {
    const pattern = /^\d{1,3}:\d{1,3}$/;
    if (!pattern.test(ref)) return false;

    const [surah, ayah] = ref.split(':').map(Number);

    // Validate Surah number (1-114)
    if (surah < 1 || surah > 114) return false;

    // Validate Ayah exists (basic check, could be enhanced with actual ayah counts)
    if (ayah < 1) return false;

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
