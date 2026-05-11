'use client';

import React, { useState } from 'react';

const REPORT_TYPES = [
    { id: 'progress', label: 'Student Progress Report', icon: '📈' },
    { id: 'attendance', label: 'Attendance Log', icon: '📅' },
    { id: 'finance', label: 'Finance Report', icon: '💰' },
    { id: 'juzz', label: 'Juzz Completion Report', icon: '📖' },
    { id: 'qaida', label: 'Noorani Qaida Report', icon: '🔤' },
];

export default function ReportsPage() {
    const [selectedReports, setSelectedReports] = useState<string[]>([]);
    const [generationMode, setGenerationMode] = useState<'combined' | 'separate'>('combined');

    const [filters, setFilters] = useState({
        classId: '',
        studentId: '',
        period: 'This Month',
        dateFrom: '',
        dateTo: ''
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedStatus, setGeneratedStatus] = useState<string | null>(null);

    const toggleReport = (id: string) => {
        setGeneratedStatus(null);
        if (selectedReports.includes(id)) {
            setSelectedReports(selectedReports.filter(r => r !== id));
        } else {
            setSelectedReports([...selectedReports, id]);
        }
    };

    const selectAll = () => {
        setGeneratedStatus(null);
        if (selectedReports.length === REPORT_TYPES.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(REPORT_TYPES.map(r => r.id));
        }
    };

    const handleGenerate = () => {
        if (selectedReports.length === 0) {
            setGeneratedStatus('Please select at least one report.');
            return;
        }
        setIsGenerating(true);
        setGeneratedStatus(null);

        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedStatus(`Successfully generated ${selectedReports.length} report(s) ${generationMode === 'combined' ? 'in a single combined file' : 'as separate files'}.`);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2F6B4F]/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-[#2F6B4F] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#2F6B4F]/20">📊</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-[#1c3c33] tracking-tight">Reports & Analytics</h1>
                        </div>
                        <p className="text-[#1c3c33]/60 font-bold text-sm">Generate and export institutional records.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-[#1c3c33] border border-[#d0d8cf] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#2F6B4F] hover:text-[#2F6B4F] transition-all shadow-sm">View Saved Archives</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Report Selection */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight">Select Reports</h2>
                                    <p className="text-[10px] font-bold text-[#1c3c33]/40 uppercase tracking-widest mt-1">Choose one or multiple data sets.</p>
                                </div>
                                <button
                                    onClick={selectAll}
                                    className="text-[10px] font-black text-[#2F6B4F] bg-[#E5F4EC] px-4 py-2 rounded-xl uppercase tracking-widest hover:opacity-80 transition-all border border-[#2F6B4F]/20"
                                >
                                    {selectedReports.length === REPORT_TYPES.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {REPORT_TYPES.map((report) => {
                                    const isSelected = selectedReports.includes(report.id);
                                    return (
                                        <button
                                            key={report.id}
                                            onClick={() => toggleReport(report.id)}
                                            className={`p-6 rounded-3xl text-left transition-all border outline-none ${isSelected
                                                    ? 'bg-[#E5F4EC] border-[#2F6B4F]/30 shadow-sm'
                                                    : 'bg-[#FDFBF7] border-[#d0d8cf] hover:border-[#2F6B4F]/50 hover:bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-2xl ${isSelected ? 'opacity-100' : 'opacity-70 grayscale'}`}>{report.icon}</span>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#2F6B4F] border-[#2F6B4F]' : 'border-[#d0d8cf] bg-white'
                                                    }`}>
                                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                                </div>
                                            </div>
                                            <h3 className={`font-black tracking-tight ${isSelected ? 'text-[#2F6B4F]' : 'text-[#1c3c33]'}`}>{report.label}</h3>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Export Mode Toggle */}
                            <div className="mt-10 pt-8 border-t border-[#1c3c33]/5">
                                <h3 className="text-sm font-black text-[#1c3c33] uppercase tracking-widest mb-4">Export Formatting</h3>
                                <div className="flex bg-[#FDFBF7] p-1.5 rounded-2xl border border-[#d0d8cf]">
                                    <button
                                        onClick={() => setGenerationMode('combined')}
                                        className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${generationMode === 'combined'
                                                ? 'bg-white text-[#2F6B4F] shadow-sm border border-[#2F6B4F]/20'
                                                : 'text-[#1c3c33]/40 hover:text-[#1c3c33]'
                                            }`}
                                    >
                                        Combine into One File
                                    </button>
                                    <button
                                        onClick={() => setGenerationMode('separate')}
                                        className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${generationMode === 'separate'
                                                ? 'bg-white text-[#2F6B4F] shadow-sm border border-[#2F6B4F]/20'
                                                : 'text-[#1c3c33]/40 hover:text-[#1c3c33]'
                                            }`}
                                    >
                                        Export as Separate Files
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Parameters and Generation */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#1c3c33]/5 shadow-[0_10px_40px_rgba(28,60,51,0.03)] sticky top-8">
                            <h2 className="text-2xl font-black text-[#1c3c33] tracking-tight mb-8">Filter Parameters</h2>

                            <div className="space-y-6">
                                {/* Class Filter */}
                                <FormSection label="Select Class" description="Optional">
                                    <select
                                        className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all appearance-none cursor-pointer"
                                        value={filters.classId}
                                        onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
                                    >
                                        <option value="">All Classes</option>
                                        <option value="zaid">Hifz Halqa Zaid Bin Sabit</option>
                                        <option value="abu">Hifz Halqa Abu Bakr</option>
                                        <option value="noorani">Noorani Qaida Group</option>
                                    </select>
                                </FormSection>

                                {/* Student Filter */}
                                <FormSection label="Select Student" description="Optional">
                                    <select
                                        className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all appearance-none cursor-pointer"
                                        value={filters.studentId}
                                        onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                                    >
                                        <option value="">All Students</option>
                                        <option value="stu1">Abdul Momin</option>
                                        <option value="stu2">M. Hassan</option>
                                        <option value="stu3">Tahoor E Mustafa</option>
                                    </select>
                                </FormSection>

                                {/* Report Period */}
                                <FormSection label="Report Period">
                                    <select
                                        className="w-full px-6 py-4 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-sm rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all appearance-none cursor-pointer"
                                        value={filters.period}
                                        onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                                    >
                                        <option value="Today">Today</option>
                                        <option value="This Week">This Week</option>
                                        <option value="This Month">This Month</option>
                                        <option value="Year to Date">Year to Date</option>
                                        <option value="Custom Dates">Custom Dates...</option>
                                    </select>
                                </FormSection>

                                {/* Custom Dates (Conditional) */}
                                {filters.period === 'Custom Dates' && (
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1c3c33]/5">
                                        <FormSection label="Date From">
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-xs rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all"
                                                value={filters.dateFrom}
                                                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                            />
                                        </FormSection>
                                        <FormSection label="Date To">
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#d0d8cf] text-[#1c3c33] font-bold text-xs rounded-2xl focus:outline-none focus:border-[#2F6B4F] focus:ring-4 focus:ring-[#2F6B4F]/10 transition-all"
                                                value={filters.dateTo}
                                                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                            />
                                        </FormSection>
                                    </div>
                                )}
                            </div>

                            {/* Generate Button Area */}
                            <div className="mt-10 pt-8 border-t border-[#1c3c33]/5">
                                {generatedStatus && (
                                    <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center border ${generatedStatus.includes('Please') ? 'bg-[#FFEBEE] text-[#D32F2F] border-[#D32F2F]/20' : 'bg-[#E5F4EC] text-[#2F6B4F] border-[#2F6B4F]/20'
                                        }`}>
                                        {generatedStatus}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full py-6 bg-[#2F6B4F] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#285c44] transition-all shadow-xl shadow-[#2F6B4F]/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Synthesizing Data...
                                        </>
                                    ) : (
                                        <>
                                            Generate Report
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] font-bold text-[#1c3c33]/30 uppercase tracking-widest mt-4">
                                    Selected {selectedReports.length} of {REPORT_TYPES.length} reports
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormSection({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-[#1c3c33]/70 uppercase tracking-widest">{label}</label>
                {description && <span className="text-[10px] font-bold text-[#1c3c33]/30">{description}</span>}
            </div>
            {children}
        </div>
    );
}

