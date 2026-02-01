"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setUnauthorizedHandler } from "@/lib/api";
import { getLoginRedirectUrl, type UserProfile } from "@/lib/auth";

const USERS_ME = "/api/v1/users/me";
const LOGOUT_ENDPOINT = "/api/v1/auth/logout";

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

  const clearAndRedirect = useCallback(() => {
    setState({
      isLoggedIn: false,
      userProfile: null,
      isLoading: false,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  const parseUserProfile = useCallback((res: { data?: unknown }): UserProfile | null => {
    const raw = res.data;
    const obj =
      raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : null;
    if (obj && ("id" in obj || "userId" in obj || "email" in obj)) {
      const id = obj.id ?? obj.userId;
      return { ...obj, id: id != null ? String(id) : "" } as UserProfile;
    }
    const nested =
      obj?.data ?? obj?.user ?? obj?.content ?? obj?.result;
    if (nested && typeof nested === "object" && ("id" in nested || "userId" in nested || "email" in nested)) {
      const n = nested as Record<string, unknown>;
      const id = n.id ?? n.userId;
      return { ...n, id: id != null ? String(id) : "" } as UserProfile;
    }
    return null;
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      const res = await api.get<unknown>(USERS_ME);
      const profile = parseUserProfile(res);
      setState((prev) => ({
        ...prev,
        isLoggedIn: !!profile,
        userProfile: profile,
        isLoading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoggedIn: false,
        userProfile: null,
        isLoading: false,
      }));
    }
  }, [parseUserProfile]);

  useEffect(() => {
    setUnauthorizedHandler(clearAndRedirect);
    return () => setUnauthorizedHandler(null);
  }, [clearAndRedirect]);

  // 쿠키가 있으면 새로고침해도 Me API 200 → 로그인 UI 유지. 401/403 → 로그아웃 UI.
  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const runMe = async (retry = false) => {
      try {
        const res = await api.get<unknown>(USERS_ME);
        if (cancelled) return;
        const profile = parseUserProfile(res);
        setState({
          isLoggedIn: !!profile,
          userProfile: profile,
          isLoading: false,
        });
      } catch {
        if (cancelled) return;
        // users/me 401 → user null로 업데이트, 리다이렉트 없이 앱 구동 계속 (인터셉터에서 users/me 401 예외 처리)
        if (!retry) {
          retryTimer = setTimeout(() => {
            runMe(true);
          }, 800);
          return;
        }
        setState({
          isLoggedIn: false,
          userProfile: null,
          isLoading: false,
        });
      }
    };
    runMe();
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [parseUserProfile]);

  // OAuth 리다이렉트 복귀·탭 전환 시 로그인 상태 재동기화
  useEffect(() => {
    const onVisible = () => {
      refetchUser();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refetchUser]);

  const loginRedirect = useCallback(() => {
    window.location.href = getLoginRedirectUrl();
  }, []);

  // 가이드: 1) POST /api/v1/auth/logout (withCredentials) 2) 전역 유저 상태 null 3) 메인/로그인 페이지 이동
  const logout = useCallback(async () => {
    try {
      await api.post(LOGOUT_ENDPOINT); // withCredentials: true (api 기본값)
    } finally {
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
