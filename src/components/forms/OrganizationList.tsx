'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

type OrganizationListProps = {
    onSelect: (organization: Organization) => void;
    selectedOrganization?: Organization | null;
};

export default function OrganizationList({ 
    onSelect, 
    selectedOrganization 
}: OrganizationListProps) {
    const { t, lang } = useLanguage();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isUrdu = lang === 'ur';

    // Fetch all organizations on mount
    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch all organizations (empty search query returns all)
                const response = await fetch('/api/organizations/search?q=');
                const data = await response.json();

                if (response.ok) {
                    setOrganizations(data.organizations || []);
                } else {
                    setError(data.message || 'Failed to load organizations');
                    setOrganizations([]);
                }
            } catch (err) {
                setError('Failed to load organizations');
                setOrganizations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    const handleSelect = (organization: Organization) => {
        onSelect(organization);
    };

    if (loading) {
        return (
            <div className="space-y-4" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="animate-pulse">
                    <div className="h-6 bg-[#1c3c33]/10 rounded mb-3 w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-[#1c3c33]/5 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="text-center py-8" dir={isUrdu ? 'rtl' : 'ltr'}>
                <div className="text-4xl mb-2">🏫</div>
                <p className="text-sm text-[#1c3c33]/60 mb-4">
                    {t('No madrasahs registered yet', 'ابھی تک کوئی مدرسہ رجسٹرڈ نہیں')}
                </p>
                <p className="text-xs text-[#1c3c33]/50">
                    {t('Be the first to register your madrasah!', 'پہلے اپنا مدرسہ رجسٹر کریں!')}
                </p>
            </div>
        );
    }

    return (
        <div dir={isUrdu ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-bold text-[#1c3c33] mb-4">
                {t('Select Your Madrasah', 'اپنا مدرسہ منتخب کریں')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.map((org) => {
                    const isSelected = selectedOrganization?.id === org.id;
                    
                    return (
                        <button
                            key={org.id}
                            onClick={() => handleSelect(org)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                isSelected 
                                    ? 'border-[#2F6B4F] bg-[#E5F4EC] shadow-md' 
                                    : 'border-[#d0d8cf] bg-white hover:border-[#2F6B4F] hover:bg-[#F7F1E6]'
                            }`}
                        >
                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-[#2F6B4F] rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                {/* Logo placeholder */}
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                                    isSelected ? 'bg-[#2F6B4F]' : 'bg-[#1c3c33]'
                                }`}>
                                    {org.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-sm truncate ${
                                        isSelected ? 'text-[#2F6B4F]' : 'text-[#1c3c33]'
                                    }`}>
                                        {org.name}
                                    </h4>
                                    
                                    {org.address && (
                                        <p className="text-xs text-[#1c3c33]/70 mt-1 truncate">
                                            📍 {org.address}
                                        </p>
                                    )}
                                    
                                    {org.phone && (
                                        <p className="text-xs text-[#1c3c33]/70 mt-1">
                                            📞 {org.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Selection border effect */}
                            {isSelected && (
                                <div className="absolute inset-0 rounded-xl border-2 border-[#2F6B4F] pointer-events-none"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected organization summary */}
            {selectedOrganization && (
                <div className="mt-4 p-4 bg-[#E5F4EC] border border-[#2F6B4F]/20 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2F6B4F] rounded-lg flex items-center justify-center text-white font-bold">
                            ✓
                        </div>
                        <div>
                            <p className="font-bold text-[#2F6B4F] text-sm">
                                {t('Selected Madrasah:', 'منتخب مدرسہ:')} {selectedOrganization.name}
                            </p>
                            {selectedOrganization.address && (
                                <p className="text-xs text-[#1c3c33]/70">
                                    {selectedOrganization.address}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}