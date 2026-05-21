'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProgressSchema, type CreateProgressInput } from '@/lib/validations/progress';
import type { LearningType, AttendanceStatus } from '@/types/progress';
import QaidaFields from './QaidaFields';
import NazraFields from './NazraFields';
import HifzFields from './HifzFields';

interface ProgressEntryFormProps {
    studentId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ProgressEntryForm({ studentId, onSuccess, onCancel }: ProgressEntryFormProps) {
    const [learningType, setLearningType] = useState<LearningType>('qaida');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreateProgressInput>({
        resolver: zodResolver(createProgressSchema),
        defaultValues: {
            studentId,
            date: new Date().toISOString().split('T')[0],
            learningType: 'qaida',
            attendanceStatus: 'present',
        },
    });

    const onSubmit = async (data: CreateProgressInput) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create progress record');
            }

            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLearningTypeChange = (type: LearningType) => {
        setLearningType(type);
        setValue('learningType', type);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Learning Type Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">Learning Type</label>
                <div className="flex gap-2">
                    {(['qaida', 'nazra', 'hifz'] as LearningType[]).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleLearningTypeChange(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${learningType === type
                                ? 'bg-brand-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {type === 'qaida' ? 'Noorani Qaida' : type === 'nazra' ? 'Nazra Quran' : 'Hifz Quran'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date */}
            <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    {...register('date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            {/* Attendance Status */}
            <div>
                <label htmlFor="attendanceStatus" className="block text-sm font-medium mb-2">
                    Attendance Status
                </label>
                <select
                    id="attendanceStatus"
                    {...register('attendanceStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                </select>
                {errors.attendanceStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.attendanceStatus.message}</p>
                )}
            </div>

            {/* Learning Type Specific Fields */}
            {learningType === 'qaida' && <QaidaFields register={register} errors={errors} />}
            {learningType === 'nazra' && <NazraFields register={register} errors={errors} />}
            {learningType === 'hifz' && <HifzFields register={register} errors={errors} setValue={setValue} watch={watch} />}

            {/* Teacher Remarks */}
            <div>
                <label htmlFor="teacherRemarks" className="block text-sm font-medium mb-2">
                    Teacher Remarks (Optional)
                </label>
                <textarea
                    id="teacherRemarks"
                    {...register('teacherRemarks')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Add any additional notes or observations..."
                />
                {errors.teacherRemarks && (
                    <p className="mt-1 text-sm text-red-600">{errors.teacherRemarks.message}</p>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Saving...' : 'Save Progress'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
