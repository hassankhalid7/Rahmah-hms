'use client';

import { useState } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CreateProgressInput } from '@/lib/validations/progress';
import type { HifzAyatMistake } from '@/types/progress';

interface HifzFieldsProps {
    register: UseFormRegister<CreateProgressInput>;
    errors: FieldErrors<CreateProgressInput>;
    setValue: UseFormSetValue<CreateProgressInput>;
    watch: UseFormWatch<CreateProgressInput>;
}

export default function HifzFields({ register, errors, setValue, watch }: HifzFieldsProps) {
    const [ayatMistakes, setAyatMistakes] = useState<HifzAyatMistake[]>([
        { ayah: '', mistakes: 0 },
    ]);

    const addAyatRow = () => {
        const newMistakes = [...ayatMistakes, { ayah: '', mistakes: 0 }];
        setAyatMistakes(newMistakes);
        setValue('hifzAyatMistakes', newMistakes);
    };

    const removeAyatRow = (index: number) => {
        const newMistakes = ayatMistakes.filter((_, i) => i !== index);
        setAyatMistakes(newMistakes);
        setValue('hifzAyatMistakes', newMistakes);
    };

    const updateAyatMistake = (index: number, field: 'ayah' | 'mistakes', value: string | number) => {
        const newMistakes = [...ayatMistakes];
        if (field === 'ayah') {
            newMistakes[index].ayah = value as string;
        } else {
            newMistakes[index].mistakes = Number(value);
        }
        setAyatMistakes(newMistakes);
        setValue('hifzAyatMistakes', newMistakes);
    };

    const totalMistakes = ayatMistakes.reduce((sum, item) => sum + (item.mistakes || 0), 0);

    return (
        <div className="space-y-4 p-4 bg-brand-50 rounded-lg border border-brand-200">
            <h3 className="font-semibold text-brand-900">Hifz Quran Details</h3>

            {/* Sabaq (New Lesson) */}
            <div>
                <label htmlFor="hifzSabaq" className="block text-sm font-medium mb-2">
                    Sabaq (New Lesson) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="hifzSabaq"
                    {...register('hifzSabaq')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., Surah Al-Baqarah 2:1-5"
                />
                <p className="mt-1 text-xs text-gray-500">New portion being memorized</p>
                {(errors as any).hifzSabaq && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).hifzSabaq.message}</p>
                )}
            </div>

            {/* Sabqi (Recent Revision) */}
            <div>
                <label htmlFor="hifzSabqi" className="block text-sm font-medium mb-2">
                    Sabqi (Recent Revision) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="hifzSabqi"
                    {...register('hifzSabqi')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., Previous 10 pages"
                />
                <p className="mt-1 text-xs text-gray-500">Recently memorized portion being revised</p>
                {(errors as any).hifzSabqi && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).hifzSabqi.message}</p>
                )}
            </div>

            {/* Manzil (Old Revision) */}
            <div>
                <label htmlFor="hifzManzil" className="block text-sm font-medium mb-2">
                    Manzil (Old Revision) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="hifzManzil"
                    {...register('hifzManzil')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g., Juz 1-5"
                />
                <p className="mt-1 text-xs text-gray-500">Old memorized portion being revised</p>
                {(errors as any).hifzManzil && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).hifzManzil.message}</p>
                )}
            </div>

            {/* Ayat-wise Mistakes */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                        Ayat-wise Mistakes <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={addAyatRow}
                        className="px-3 py-1 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        + Add Ayah
                    </button>
                </div>

                <div className="space-y-2">
                    {ayatMistakes.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={item.ayah}
                                    onChange={(e) => updateAyatMistake(index, 'ayah', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    placeholder="e.g., 2:255"
                                />
                            </div>
                            <div className="w-28">
                                <input
                                    type="number"
                                    value={item.mistakes}
                                    onChange={(e) => updateAyatMistake(index, 'mistakes', e.target.value)}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    placeholder="Mistakes"
                                />
                            </div>
                            {ayatMistakes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeAyatRow(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-2 p-2 bg-brand-100 rounded text-sm">
                    <strong>Total Mistakes:</strong> {totalMistakes}
                </div>

                {(errors as any).hifzAyatMistakes && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).hifzAyatMistakes.message}</p>
                )}
            </div>
        </div>
    );
}
