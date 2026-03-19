import { getBackendApiBaseUrl } from "./api";

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
  const base = getBackendApiBaseUrl();
  return `${base}/oauth2/authorization/google`;
}
