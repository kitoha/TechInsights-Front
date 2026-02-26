"use client";

import { cn } from "@/lib/shared/utils";

interface StateViewProps {
    type: 'empty' | 'error';
    keyword?: string;
    onActionPrimary?: () => void;
    onActionSecondary?: () => void;
}

export function StateView({ type, keyword, onActionPrimary, onActionSecondary }: StateViewProps) {
    const isError = type === 'error';

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
            {/* Icon Container */}
            <div className="relative mb-8">
                <div className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center transition-colors shadow-inner",
                    isError
                        ? "bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20"
                        : "bg-gray-50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-700/30"
                )}>
                    {isError ? (
                        <div className="relative">
                            <svg className="w-12 h-12 text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" className="text-red-600" />
                            </svg>
                        </div>
                    ) : (
                        <div className="relative">
                            <svg className="w-12 h-12 text-blue-500/60 dark:text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 p-0.5">
                                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
                {/* Decorative elements */}
                <div className={cn(
                    "absolute -inset-4 rounded-full blur-2xl opacity-20 -z-10",
                    isError ? "bg-red-500" : "bg-blue-500"
                )} />
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                {isError ? "데이터를 불러오는 중 오류가 발생했습니다" : "검색 결과가 없습니다"}
            </h2>

            <div className="max-w-md mx-auto mb-10">
                {isError ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        일시적인 네트워크 문제이거나 서버 점검 중일 수 있습니다.<br />
                        잠시 후 다시 시도해 주세요. 문제가 지속되면 고객센터에 문의해 주세요.
                    </p>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {keyword && (
                            <span className="block mb-1">
                                "<span className="text-blue-600 dark:text-blue-400 font-bold">{keyword}</span>"에 대한 결과를 찾을 수 없습니다.
                            </span>
                        )}
                        다른 키워드로 검색하거나 필터를 변경해 보세요.
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                {isError ? (
                    <>
                        <button
                            onClick={onActionPrimary}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            다시 시도
                        </button>
                        <button
                            onClick={onActionSecondary}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold transition-all active:scale-95"
                        >
                            고객센터 문의
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onActionSecondary}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold transition-all active:scale-95"
                        >
                            필터 초기화
                        </button>
                        <button
                            onClick={onActionPrimary}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            전체 보기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
