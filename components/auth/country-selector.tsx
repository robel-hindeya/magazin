'use client';

import * as React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

export interface CountryCodeItem {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

export const COUNTRIES_A_Z: CountryCodeItem[] = [
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dial: '+61' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dial: '+32' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dial: '+253' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dial: '+20' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dial: '+291' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dial: '+251' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dial: '+33' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dial: '+91' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dial: '+972' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dial: '+39' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dial: '+31' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dial: '+47' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dial: '+252' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '+27' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dial: '+211' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dial: '+249' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dial: '+46' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dial: '+41' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dial: '+90' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dial: '+256' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dial: '+1' },
].sort((a, b) => a.name.localeCompare(b.name));

interface CountrySelectorProps {
  value: string;
  onChange: (dial: string) => void;
  className?: string;
}

export function CountrySelector({ value, onChange, className = '' }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Selected country lookup (fallback to Ethiopia if unmatched)
  const selectedCountry =
    COUNTRIES_A_Z.find((c) => c.dial === value) ||
    COUNTRIES_A_Z.find((c) => c.code === 'ET') ||
    COUNTRIES_A_Z[0];

  // Filter countries alphabetically A-Z by search term (country name or dial code)
  const filteredCountries = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES_A_Z;
    return COUNTRIES_A_Z.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto focus search input when opening
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (dial: string) => {
    onChange(dial);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      {/* Trigger Button showing Flag + Dial Code */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 min-w-[115px] sm:min-w-[125px] items-center justify-between gap-1.5 rounded-2xl border-2 border-slate-200 dark:border-purple-700/80 bg-slate-50 dark:bg-purple-950/70 px-3 text-xs font-black text-slate-900 dark:text-white shadow-xs hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="tracking-tight">{selectedCountry.dial}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 dark:text-purple-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Card with Search and exactly 5-country scrollable window */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-64 sm:w-72 rounded-2xl border-2 border-slate-200 dark:border-purple-600 bg-white dark:bg-[#160b3d] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Country Search Input */}
          <div className="p-2 border-b border-slate-100 dark:border-purple-800/60 bg-slate-50/80 dark:bg-[#110733]/90">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-purple-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-purple-700/80 bg-white dark:bg-[#0c0424] text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-400/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* 5-country Visible Height List ordered A-Z */}
          {/* Each item is ~42px, max-h-[210px] displays exactly 5 countries before scrolling */}
          <div className="max-h-[210px] overflow-y-auto divide-y divide-slate-100/60 dark:divide-purple-900/40 overscroll-contain">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.dial === value;
                return (
                  <button
                    key={`${country.code}-${country.dial}`}
                    type="button"
                    onClick={() => handleSelect(country.dial)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black'
                        : 'text-slate-800 dark:text-purple-100 hover:bg-slate-100 dark:hover:bg-purple-900/50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none shrink-0">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-purple-300">
                        {country.dial}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-purple-300 font-medium">
                No country found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
