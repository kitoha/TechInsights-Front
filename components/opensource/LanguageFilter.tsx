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

    const handleSelect = (lang: LanguageFilterType) => {
        onChange(lang);
        setIsOpen(false);
        setSearchQuery("");
    };

    const handleClear = () => {
        onChange('All Languages');
    };

    return (
        <div className="flex items-center gap-3 flex-wrap" ref={dropdownRef}>
            {/* Searchable Dropdown Button */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center justify-between gap-3 min-w-[150px] rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-800 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-900/50 dark:focus:ring-blue-900/20",
                        isOpen && "border-blue-500 ring-2 ring-blue-100 dark:border-blue-500/50 dark:ring-blue-900/30 shadow-blue-500/5"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        <span className="truncate">Languages</span>
                    </div>
                    <svg className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 dark:border-gray-800 dark:bg-gray-900/95 dark:backdrop-blur-xl">
                        {/* Search Input Area */}
                        <div className="p-3 border-b border-gray-50 dark:border-gray-800">
                            <div className="relative group">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="언어 검색..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl bg-gray-50 border-none px-10 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500/20 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Language List */}
                        <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar space-y-0.5">
                            {filteredLanguages.length > 0 ? (
                                filteredLanguages.map((lang) => {
                                    const isSelected = selected === lang;
                                    const langColor = LANGUAGE_COLORS[lang] || 'transparent';
                                    return (
                                        <button
                                            key={lang}
                                            onClick={() => handleSelect(lang)}
                                            className={cn(
                                                "flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-left text-[13px] transition-all group",
                                                isSelected
                                                    ? "bg-blue-50 text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full transition-transform group-hover:scale-125",
                                                    lang === 'All Languages' ? "border border-gray-300 dark:border-gray-600" : ""
                                                )} style={{ backgroundColor: langColor }} />
                                                <span>{lang}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-10 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">검색 결과가 없습니다</p>
                                    <p className="text-[11px] text-gray-500 mt-1">다른 검색어를 입력해 보세요</p>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Footer */}
                        <div className="p-3 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                            <button className="w-full py-2 flex items-center justify-center gap-2 rounded-lg text-[12px] font-bold text-blue-600 hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20">
                                View all 50+ languages
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Language Chip */}
            {selected !== 'All Languages' && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
                    <div className="flex items-center gap-2 rounded-full bg-blue-50/50 border border-blue-100/50 pl-2.5 pr-1.5 py-1 dark:bg-blue-900/10 dark:border-blue-900/30">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[selected] }} />
                        <span className="text-[12px] font-bold text-blue-700 dark:text-blue-400">{selected}</span>
                        <button
                            onClick={handleClear}
                            className="ml-1 p-0.5 rounded-full hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors dark:hover:bg-blue-900/50 dark:text-blue-500 dark:hover:text-blue-300"
                            aria-label={`Clear ${selected} filter`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Spacer to push 'Go' button if needed, or keeping it compact */}
            <div className="flex-1" />

            {/* Go Button - Enterprise Style */}
            <button
                onClick={() => onChange(selected)}
                className="relative group px-5 py-2.5 rounded-xl bg-blue-600 text-[13px] font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                <span className="relative z-10">Apply Filter</span>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
    );
}
