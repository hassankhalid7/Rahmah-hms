'use client';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { CreateProgressInput } from '@/lib/validations/progress';

interface NazraFieldsProps {
    register: UseFormRegister<CreateProgressInput>;
    errors: FieldErrors<CreateProgressInput>;
}

export default function NazraFields({ register, errors }: NazraFieldsProps) {
    return (
        <div className="space-y-4 p-4 bg-brand-50 rounded-lg border border-brand-200">
            <h3 className="font-semibold text-brand-900">Nazra Quran Details</h3>

            {/* Para Number */}
            <div>
                <label htmlFor="nazraParaNumber" className="block text-sm font-medium mb-2">
                    Para Number (1-30) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="nazraParaNumber"
                    {...register('nazraParaNumber', { valueAsNumber: true })}
                    min="1"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 2"
                />
                {(errors as any).nazraParaNumber && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).nazraParaNumber.message}</p>
                )}
            </div>

            {/* From Ayah */}
            <div>
                <label htmlFor="nazraFromAyah" className="block text-sm font-medium mb-2">
                    From Ayah (Surah:Ayah) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="nazraFromAyah"
                    {...register('nazraFromAyah')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 2:255"
                />
                <p className="mt-1 text-xs text-gray-500">Format: Surah:Ayah (e.g., 2:255 for Ayat al-Kursi)</p>
                {(errors as any).nazraFromAyah && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).nazraFromAyah.message}</p>
                )}
            </div>

            {/* To Ayah */}
            <div>
                <label htmlFor="nazraToAyah" className="block text-sm font-medium mb-2">
                    To Ayah (Surah:Ayah) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="nazraToAyah"
                    {...register('nazraToAyah')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 2:260"
                />
                <p className="mt-1 text-xs text-gray-500">Format: Surah:Ayah</p>
                {(errors as any).nazraToAyah && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).nazraToAyah.message}</p>
                )}
            </div>

            {/* Mistakes Count */}
            <div>
                <label htmlFor="nazraMistakesCount" className="block text-sm font-medium mb-2">
                    Mistakes Count <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="nazraMistakesCount"
                    {...register('nazraMistakesCount', { valueAsNumber: true })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., 5"
                />
                {(errors as any).nazraMistakesCount && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).nazraMistakesCount.message}</p>
                )}
            </div>
        </div>
    );
}
