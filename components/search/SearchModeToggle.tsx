"use client"

import { SearchMode } from "@/lib/search/types"
import { Button } from "@/components/ui/button"

interface SearchModeToggleProps {
  currentMode: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export default function SearchModeToggle({ currentMode, onChange }: SearchModeToggleProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="검색 모드 토글">
      <Button
        variant={currentMode === "semantic" ? "default" : "outline"}
        size="sm"
        aria-pressed={currentMode === "semantic"}
        onClick={() => onChange("semantic")}
      >
        AI 검색
      </Button>
      <Button
        variant={currentMode === "keyword" ? "default" : "outline"}
        size="sm"
        aria-pressed={currentMode === "keyword"}
        onClick={() => onChange("keyword")}
      >
        일반 검색
      </Button>
    </div>
  )
}
