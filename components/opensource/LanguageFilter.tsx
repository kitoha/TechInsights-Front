"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { LanguageFilter as LanguageFilterType, LANGUAGE_COLORS } from "@/lib/opensource/types";
import { cn } from "@/lib/shared/utils";

interface LanguageFilterProps {
    selected: LanguageFilterType;
    onChange: (language: LanguageFilterType) => void;
}

const LANGUAGES: LanguageFilterType[] = [
    'All Languages', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'Zig',
    'Kotlin', 'Swift', 'Ruby', 'C++', 'C', 'Dart'
];

const QUICK_FILTERS: LanguageFilterType[] = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go'];

export function LanguageFilter({ selected, onChange }: LanguageFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredLanguages = useMemo(() => {
        return LANGUAGES.filter(lang =>
            lang.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="flex items-center gap-2 flex-wrap" ref={dropdownRef}>
            {/* Searchable Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center justify-between gap-2 min-w-[140px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:focus:ring-blue-900/30",
                        isOpen && "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
                    )}
                >
                    <span className="truncate">{selected}</span>
                    <svg className={cn("w-3 h-3 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 dark:border-gray-700 dark:bg-gray-900/95 dark:backdrop-blur-md">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-50 dark:border-gray-800">
                            <div className="relative">
                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="언어 검색..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg bg-gray-50 border-none px-8 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar">
                            {filteredLanguages.length > 0 ? (
                                filteredLanguages.map((lang) => {
                                    const isSelected = selected === lang;
                                    const langColor = LANGUAGE_COLORS[lang] || 'transparent';
                                    return (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                onChange(lang);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                                                isSelected
                                                    ? "bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1 ring-transparent",
                                                    lang === 'All Languages' ? "border border-gray-300 dark:border-gray-600" : ""
                                                )} style={{ backgroundColor: langColor }} />
                                                <span>{lang}</span>
                                            </div>
                                            {isSelected && (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-8 px-4 text-center">
                                    <svg className="mx-auto w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">검색 결과가 없습니다</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                            <button className="w-full py-1 text-center text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                View all 50+ languages
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick filters */}
            <div className="hidden sm:flex items-center gap-2">
                {QUICK_FILTERS.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => onChange(selected === lang ? 'All Languages' : lang)}
                        className={cn(
                            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                            selected === lang
                                ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                    >
                        {selected === lang && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={(e) => { e.stopPropagation(); onChange('All Languages'); }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" />
                            </svg>
                        )}
                        {lang}
                    </button>
                ))}
            </div>

            {/* Go button */}
            <button
                onClick={() => onChange(selected)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Go
            </button>
        </div>
    );
}
