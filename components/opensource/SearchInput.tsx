"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/shared/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        onChange("");
        inputRef.current?.focus();
    };

    return (
        <div className={cn("relative group flex-1 min-w-[280px]", className)}>
            <div className={cn(
                "relative flex items-center w-full transition-all duration-300",
                "rounded-xl border bg-white shadow-sm dark:bg-gray-950",
                isFocused
                    ? "border-blue-500 ring-2 ring-blue-100 dark:border-blue-500/50 dark:ring-blue-900/20 shadow-blue-500/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            )}>
                {/* Search Icon */}
                <div className="pl-4 pr-2 flex items-center justify-center pointer-events-none">
                    <svg
                        className={cn(
                            "w-4 h-4 transition-colors duration-200",
                            isFocused ? "text-blue-500" : "text-gray-400"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder || "레포 검색... (예: '실시간 채팅' 또는 'socket.io')"}
                    className="w-full bg-transparent border-none py-2.5 pr-20 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-600"
                />

                {/* Clear Button */}
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-12 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" />
                        </svg>
                    </button>
                )}

                {/* AI Badge */}
                <div className="absolute right-3 flex items-center">
                    <div className="flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 border border-violet-100 dark:bg-violet-900/20 dark:border-violet-800/30">
                        <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-tight">✨ AI</span>
                    </div>
                </div>
            </div>

            {/* Ambient Glow on Focus */}
            <div className={cn(
                "absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-500 -z-10 bg-gradient-to-r from-blue-500/5 to-violet-500/5",
                isFocused ? "opacity-100" : "opacity-0"
            )} />
        </div>
    );
}
