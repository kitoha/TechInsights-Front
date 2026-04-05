"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authGet, authPost, setUnauthorizedHandler } from "@/lib/shared/api";
import { getLoginRedirectUrl, type UserProfile } from "@/lib/shared/auth";
import { getDeviceId } from "@/lib/shared/deviceId";

import { USERS_ME_ENDPOINT, LOGOUT_ENDPOINT } from "@/lib/shared/endpoints";
const AUTH_PENDING_SYNC_KEY = "techinsights_auth_pending_sync";

interface AuthState {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  loginRedirect: () => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    userProfile: null,
    isLoading: true,
  });

  const authCheckedRef = useRef(false);
  const isLoggedInRef = useRef(false);

  const consumePendingAuthSync = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    const pending = window.sessionStorage.getItem(AUTH_PENDING_SYNC_KEY) === "1";
    if (pending) {
      window.sessionStorage.removeItem(AUTH_PENDING_SYNC_KEY);
    }
    return pending;
  }, []);

  const markPendingAuthSync = useCallback(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(AUTH_PENDING_SYNC_KEY, "1");
  }, []);

  const clearAndRedirect = useCallback(() => {
    setState({
      isLoggedIn: false,
      userProfile: null,
      isLoading: false,
    });
    isLoggedInRef.current = false;
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  const parseUserProfile = useCallback((res: { data?: unknown }): UserProfile | null => {
    const raw = res.data;
    if (!raw || typeof raw !== "object") return null;

    const obj = raw as Record<string, unknown>;

    // Check direct properties
    if ("id" in obj || "userId" in obj || "email" in obj) {
      const id = obj.id ?? obj.userId;
      return { ...obj, id: id != null ? String(id) : "" } as UserProfile;
    }

    // Check nested properties
    const nested = obj.data ?? obj.user ?? obj.content ?? obj.result;
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      if ("id" in n || "userId" in n || "email" in n) {
        const id = n.id ?? n.userId;
        return { ...n, id: id != null ? String(id) : "" } as UserProfile;
      }
    }
    return null;
  }, []);

  const fetchUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const res = await authGet<unknown>(USERS_ME_ENDPOINT, {
        validateStatus: (s) => s < 500,
      });
      return res.status === 200 ? parseUserProfile(res) : null;
    } catch (error) {
      console.error("[AuthContext] fetchUserProfile failed", error);
      return null;
    }
  }, [parseUserProfile]);

  const updateAuthState = useCallback((profile: UserProfile | null) => {
    isLoggedInRef.current = !!profile;
    authCheckedRef.current = true;
    setState((prev) => ({
      ...prev,
      isLoggedIn: !!profile,
      userProfile: profile,
      isLoading: false,
    }));
  }, []);

  // 외부에서 명시적으로 호출하는 refetch - 로그인 후 상태 갱신 목적
  const refetchUser = useCallback(async () => {
    const profile = await fetchUserProfile();
    updateAuthState(profile);
  }, [fetchUserProfile, updateAuthState]);

  useEffect(() => {
    setUnauthorizedHandler(clearAndRedirect);
    return () => setUnauthorizedHandler(null);
  }, [clearAndRedirect]);
  useEffect(() => {
    let cancelled = false;
    const shouldForceSync = consumePendingAuthSync();
    const runMe = async () => {
      const profile = await fetchUserProfile();
      if (cancelled) return;
      updateAuthState(profile);
      if (shouldForceSync && !profile) {
        void refetchUser();
      }
    };
    runMe();
    return () => { cancelled = true; };
  }, [consumePendingAuthSync, fetchUserProfile, refetchUser, updateAuthState]);

  // OAuth 리다이렉트 복귀 시 로그인 상태 재동기화
  // - visibilitychange만 사용 (focus와 중복 발화 방지)
  // - 로그인 상태인 경우에만 재검증, 비로그인 확정 시 불필요한 호출 차단
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (!authCheckedRef.current) return;
      if (consumePendingAuthSync()) {
        refetchUser();
        return;
      }
      // 비로그인 상태가 확정된 경우에는 재호출 안 함
      // (OAuth 리다이렉트 후 돌아왔을 때는 페이지 자체가 reload되므로 커버됨)
      if (!isLoggedInRef.current) return;
      refetchUser();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [consumePendingAuthSync, refetchUser]);

  const loginRedirect = useCallback(() => {
    markPendingAuthSync();
    const loginUrl = new URL(getLoginRedirectUrl(), window.location.origin);
    loginUrl.searchParams.set("deviceId", getDeviceId());
    window.location.href = loginUrl.toString();
  }, [markPendingAuthSync]);

  const logout = useCallback(async () => {
    try {
      await authPost(LOGOUT_ENDPOINT);
    } finally {
      isLoggedInRef.current = false;
      setState({
        isLoggedIn: false,
        userProfile: null,
        isLoading: false,
      });
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      loginRedirect,
      logout,
      refetchUser,
    }),
    [state, loginRedirect, logout, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
