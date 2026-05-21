'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language-context';

type Organization = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
};

type OrganizationSearchProps = {
    onSelect: (organization: Organization) => void;
    selectedOrganization?: Organization | null;
    placeholder?: string;
};

export default function OrganizationSearch({ 
    onSelect, 
    selectedOrganization, 
    placeholder 
}: OrganizationSearchProps) {
    const { t, lang } = useLanguage();
    const [query, setQuery] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const isUrdu = lang === 'ur';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search organizations
    useEffect(() => {
        const searchOrganizations = async () => {
            // We allow empty query to show all organizations on initial click/focus
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/organizations/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (response.ok) {
                    setOrganizations(data.organizations || []);
                    // Only show dropdown if there are results or user is typing
                    if (data.organizations?.length > 0 || query.length > 0) {
                        setShowDropdown(true);
                    }
                } else {
                    setError(data.message || 'Search failed');
                    setOrganizations([]);
                    setShowDropdown(false);
                }
            } catch (err) {
                setError('Failed to search organizations');
                setOrganizations([]);
                setShowDropdown(false);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchOrganizations, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleFocus = () => {
        if (organizations.length > 0 || query === '') {
            setShowDropdown(true);
        }
    };

    const handleSelect = (organization: Organization) => {
        onSelect(organization);
        setQuery(organization.name);
        setShowDropdown(false);
    };

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (selectedOrganization && value !== selectedOrganization.name) {
            onSelect(null as any); // Clear selection if user types different text
        }
    };

    return (
        <div className="relative" ref={searchRef} dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="relative">
                <input
                    type="text"
                    value={selectedOrganization ? selectedOrganization.name : query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={handleFocus}
                    placeholder={placeholder || t('Search for madrasah...', 'مدرسہ تلاش کریں...')}
                    className="w-full px-4 py-3 border border-[#d0d8cf] rounded-xl bg-white text-[#1c3c33] placeholder-[#1c3c33]/50 focus:outline-none focus:ring-2 focus:ring-[#2F6B4F] focus:border-transparent transition-all"
                />
                
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2F6B4F]"></div>
                    </div>
                )}

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1c3c33]/40">
                    🔍
                </div>
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-[#d0d8cf] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {organizations.length > 0 ? (
                        <div className="py-2">
                            {organizations.map((org) => (
                                <button
                                    key={org.id}
                                    onClick={() => handleSelect(org)}
                                    className="w-full px-4 py-3 text-left hover:bg-[#F7F1E6] transition-colors border-b border-[#d0d8cf]/30 last:border-b-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-[#2F6B4F] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {org.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#1c3c33] text-sm truncate">
                                                {org.name}
                                            </h4>
                                            {org.address && (
                                                <p className="text-xs text-[#1c3c33]/60 mt-1 truncate">
                                                    📍 {org.address}
                                                </p>
                                            )}
                                            {org.phone && (
                                                <p className="text-xs text-[#1c3c33]/60 mt-1">
                                                    📞 {org.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query.length >= 2 && !loading ? (
                        <div className="py-8 text-center text-[#1c3c33]/60">
                            <div className="text-2xl mb-2">🔍</div>
                            <p className="text-sm">
                                {t('No madrasah found', 'کوئی مدرسہ نہیں ملا')}
                            </p>
                            <p className="text-xs mt-1">
                                {t('Try different search terms', 'مختلف الفاظ آزمائیں')}
                            </p>
                        </div>
                    ) : null}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* Selected organization display */}
            {selectedOrganization && (
                <div className="mt-3 p-3 bg-[#E5F4EC] border border-[#2F6B4F]/20 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2F6B4F] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            ✓
                        </div>
                        <div>
                            <p className="font-bold text-[#1c3c33] text-sm">
                                {t('Selected:', 'منتخب:')} {selectedOrganization.name}
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