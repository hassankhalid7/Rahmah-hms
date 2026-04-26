'use client';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200"
        >
            Download PDF / Print
        </button>
    );
}
