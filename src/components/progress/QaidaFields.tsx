'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { CreateProgressInput } from '@/lib/validations/progress';

interface QaidaFieldsProps {
    register: UseFormRegister<CreateProgressInput>;
    errors: FieldErrors<CreateProgressInput>;
}

const QAIDA_TOPICS = [
    'Huroof (Letters)',
    'Harakat (Vowel Marks)',
    'Madd (Elongation)',
    'Tanween (Nunation)',
    'Sukoon (Silence)',
    'Tashdeed (Emphasis)',
    'Waqf (Stopping)',
    'Makharij (Articulation Points)',
];

export default function QaidaFields({ register, errors }: QaidaFieldsProps) {
    return (
        <div className="space-y-4 p-4 bg-brand-50 rounded-lg border border-brand-200">
            <h3 className="font-semibold text-brand-900">Noorani Qaida Details</h3>

            {/* Lesson Number */}
            <div>
                <label htmlFor="qaidaLessonNumber" className="block text-sm font-medium mb-2">
                    Lesson Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="qaidaLessonNumber"
                    {...register('qaidaLessonNumber', { valueAsNumber: true })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 5"
                />
                {(errors as any).qaidaLessonNumber && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).qaidaLessonNumber.message}</p>
                )}
            </div>

            {/* Page Number */}
            <div>
                <label htmlFor="qaidaPageNumber" className="block text-sm font-medium mb-2">
                    Page Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="qaidaPageNumber"
                    {...register('qaidaPageNumber', { valueAsNumber: true })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 12"
                />
                {(errors as any).qaidaPageNumber && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).qaidaPageNumber.message}</p>
                )}
            </div>

            {/* Topic */}
            <div>
                <label htmlFor="qaidaTopic" className="block text-sm font-medium mb-2">
                    Topic <span className="text-red-500">*</span>
                </label>
                <select
                    id="qaidaTopic"
                    {...register('qaidaTopic')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                    <option value="">Select a topic</option>
                    {QAIDA_TOPICS.map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
                {(errors as any).qaidaTopic && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).qaidaTopic.message}</p>
                )}
            </div>

            {/* Mistakes Count */}
            <div>
                <label htmlFor="qaidaMistakesCount" className="block text-sm font-medium mb-2">
                    Mistakes Count <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="qaidaMistakesCount"
                    {...register('qaidaMistakesCount', { valueAsNumber: true })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 3"
                />
                {(errors as any).qaidaMistakesCount && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).qaidaMistakesCount.message}</p>
                )}
            </div>
        </div>
    );
}
