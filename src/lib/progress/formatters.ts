import type { DailyProgress } from '@/types/progress';
import type { ProgressEditHistory } from '@/db/schema/progress';

/**
 * Formats a progress record into a human-readable summary
 */
export function formatProgressSummary(progress: DailyProgress): string {
    const date = new Date(progress.date).toLocaleDateString();

    switch (progress.learningType) {
        case 'qaida':
            return `Qaida - Lesson ${progress.qaidaLessonNumber}, Page ${progress.qaidaPageNumber} (${progress.qaidaTopic}) - ${progress.qaidaMistakesCount} mistakes on ${date}`;

        case 'nazra':
            return `Nazra - Para ${progress.nazraParaNumber}, ${progress.nazraFromAyah} to ${progress.nazraToAyah} - ${progress.nazraMistakesCount} mistakes on ${date}`;

        case 'hifz':
            const totalMistakes = progress.hifzAyatMistakes.reduce((sum, item) => sum + item.mistakes, 0);
            return `Hifz - Sabaq: ${progress.hifzSabaq}, Sabqi: ${progress.hifzSabqi} - ${totalMistakes} total mistakes on ${date}`;

        default:
            return `Progress record from ${date}`;
    }
}

/**
 * Formats edit history into a readable string
 */
export function formatEditHistory(history: ProgressEditHistory[]): string {
    if (history.length === 0) return 'No edit history';

    return history
        .map((edit, index) => {
            const date = new Date(edit.editedAt).toLocaleString();
            return `${index + 1}. Edited on ${date}${edit.changesSummary ? `: ${edit.changesSummary}` : ''}`;
        })
        .join('\n');
}

/**
 * Formats an ayah range for display
 */
export function formatAyahRange(from: string, to: string): string {
    const [fromSurah, fromAyah] = from.split(':');
    const [toSurah, toAyah] = to.split(':');

    if (fromSurah === toSurah) {
        return `Surah ${fromSurah}, Ayah ${fromAyah}-${toAyah}`;
    }

    return `${from} to ${to}`;
}

/**
 * Generates a summary of changes between two progress records
 */
export function generateChangesSummary(oldData: any, newData: any): string {
    const changes: string[] = [];

    // Check common fields
    if (oldData.attendanceStatus !== newData.attendanceStatus) {
        changes.push(`Attendance: ${oldData.attendanceStatus} → ${newData.attendanceStatus}`);
    }

    if (oldData.teacherRemarks !== newData.teacherRemarks) {
        changes.push('Teacher remarks updated');
    }

    // Check learning type specific fields
    switch (newData.learningType) {
        case 'qaida':
            if (oldData.qaidaMistakesCount !== newData.qaidaMistakesCount) {
                changes.push(`Mistakes: ${oldData.qaidaMistakesCount} → ${newData.qaidaMistakesCount}`);
            }
            if (oldData.qaidaLessonNumber !== newData.qaidaLessonNumber) {
                changes.push(`Lesson: ${oldData.qaidaLessonNumber} → ${newData.qaidaLessonNumber}`);
            }
            break;

        case 'nazra':
            if (oldData.nazraMistakesCount !== newData.nazraMistakesCount) {
                changes.push(`Mistakes: ${oldData.nazraMistakesCount} → ${newData.nazraMistakesCount}`);
            }
            if (oldData.nazraParaNumber !== newData.nazraParaNumber) {
                changes.push(`Para: ${oldData.nazraParaNumber} → ${newData.nazraParaNumber}`);
            }
            break;

        case 'hifz':
            if (JSON.stringify(oldData.hifzAyatMistakes) !== JSON.stringify(newData.hifzAyatMistakes)) {
                changes.push('Ayat mistakes updated');
            }
            if (oldData.hifzSabaq !== newData.hifzSabaq) {
                changes.push(`Sabaq: ${oldData.hifzSabaq} → ${newData.hifzSabaq}`);
            }
            break;
    }

    return changes.length > 0 ? changes.join(', ') : 'Minor updates';
}
