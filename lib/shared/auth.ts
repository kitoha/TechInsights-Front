export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  profileImage?: string;
  [key: string]: unknown;
}

export function getLoginRedirectUrl(): string {
  return "/api/bff/oauth2/authorization/google";
}
