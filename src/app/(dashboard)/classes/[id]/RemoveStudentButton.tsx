'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RemoveStudentButton({ classId, studentId }: { classId: string, studentId: string }) {
    const router = useRouter();
    const [removing, setRemoving] = useState(false);

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove this student from the class?')) return;

        setRemoving(true);
        try {
            const res = await fetch(`/api/classes/${classId}/enroll?studentId=${studentId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error(await res.text());

            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to remove student');
        } finally {
            setRemoving(false);
        }
    };

    return (
        <button
            onClick={handleRemove}
            disabled={removing}
            className="text-red-400 font-bold text-xs hover:text-red-600 transition-colors disabled:opacity-50"
        >
            {removing ? 'Removing...' : 'Remove'}
        </button>
    );
}
