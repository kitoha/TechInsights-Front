"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut, User, Settings } from "lucide-react";

export function UserProfileDropdown() {
  const { userProfile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  const displayName =
    userProfile?.nickname ?? userProfile?.name ?? userProfile?.email ?? "User";
  const profileImage = userProfile?.profileImage ?? userProfile?.picture;
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full ring-offset-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring hover:opacity-90 transition-opacity"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="프로필 메뉴"
      >
        <Avatar className="size-8 sm:size-9 cursor-pointer border-2 border-border">
          <AvatarImage src={profileImage} alt={displayName} />
          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-lg border border-border bg-card shadow-lg py-1",
            "animate-in fade-in-0 zoom-in-95"
          )}
          role="menu"
        >
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User className="size-4 shrink-0" />
            My Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Settings className="size-4 shrink-0" />
            Settings
          </Link>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            <LogOut className="size-4 shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
