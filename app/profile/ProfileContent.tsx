"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileContent() {
  const { userProfile, isLoggedIn } = useAuth();

  if (!isLoggedIn || !userProfile) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
        로그인이 필요합니다.
      </div>
    );
  }

  const displayName =
    userProfile.nickname ?? userProfile.name ?? userProfile.email ?? "User";
  const profileImage = userProfile.profileImage ?? userProfile.picture;
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">My Profile</h1>
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={profileImage} alt={displayName} />
          <AvatarFallback className="text-lg bg-muted text-muted-foreground">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          {(userProfile.nickname ?? userProfile.name) && (
            <p className="text-foreground font-medium">{displayName}</p>
          )}
          {userProfile.email && (
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
