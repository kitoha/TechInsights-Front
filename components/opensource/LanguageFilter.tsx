"use client";

import { LanguageFilter as LanguageFilterType } from "@/lib/opensource/types";

interface LanguageFilterProps {
    selected: LanguageFilterType;
    onChange: (language: LanguageFilterType) => void;
}

const QUICK_FILTERS: LanguageFilterType[] = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go'];

export function LanguageFilter({ selected, onChange }: LanguageFilterProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Dropdown */}
            <div className="relative">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value as LanguageFilterType)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:focus:ring-blue-900/30"
                >
                    <option value="All Languages">All Languages</option>
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Java">Java</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Zig">Zig</option>
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Quick filter buttons */}
            {QUICK_FILTERS.map((lang) => (
                <button
                    key={lang}
                    onClick={() => onChange(selected === lang ? 'All Languages' : lang)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${selected === lang
                            ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                >
                    {lang}
                </button>
            ))}

            {/* Go button */}
            <button
                onClick={() => onChange(selected)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Go
            </button>
        </div>
    );
}
