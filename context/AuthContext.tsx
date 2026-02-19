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

  // 로그인 확인이 완료됐는지 추적 - 비로그인 확정 후 탭 전환 시 불필요한 재호출 차단
  const authCheckedRef = useRef(false);
  const isLoggedInRef = useRef(false);

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

  // 외부에서 명시적으로 호출하는 refetch - 로그인 후 상태 갱신 목적
  const refetchUser = useCallback(async () => {
    try {
      const res = await api.get<unknown>(USERS_ME, {
        validateStatus: (s) => s < 500,
      });
      const profile = res.status === 200 ? parseUserProfile(res) : null;
      isLoggedInRef.current = !!profile;
      setState((prev) => ({
        ...prev,
        isLoggedIn: !!profile,
        userProfile: profile,
        isLoading: false,
      }));
    } catch {
      isLoggedInRef.current = false;
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

  // 앱 마운트 시 1회만 호출 - 쿠키 기반 세션 확인
  // validateStatus로 401을 정상 응답으로 처리 → 브라우저 콘솔 네트워크 에러 제거
  useEffect(() => {
    let cancelled = false;
    const runMe = async () => {
      try {
        const res = await api.get<unknown>(USERS_ME, {
          validateStatus: (s) => s < 500,
        });
        if (cancelled) return;
        const profile = res.status === 200 ? parseUserProfile(res) : null;
        isLoggedInRef.current = !!profile;
        authCheckedRef.current = true;
        setState({
          isLoggedIn: !!profile,
          userProfile: profile,
          isLoading: false,
        });
      } catch {
        if (cancelled) return;
        isLoggedInRef.current = false;
        authCheckedRef.current = true;
        setState({
          isLoggedIn: false,
          userProfile: null,
          isLoading: false,
        });
      }
    };
    runMe();
    return () => { cancelled = true; };
  }, [parseUserProfile]);

  // OAuth 리다이렉트 복귀 시 로그인 상태 재동기화
  // - visibilitychange만 사용 (focus와 중복 발화 방지)
  // - 로그인 상태인 경우에만 재검증, 비로그인 확정 시 불필요한 호출 차단
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (!authCheckedRef.current) return;
      // 비로그인 상태가 확정된 경우에는 재호출 안 함
      // (OAuth 리다이렉트 후 돌아왔을 때는 페이지 자체가 reload되므로 커버됨)
      if (!isLoggedInRef.current) return;
      refetchUser();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refetchUser]);

  const loginRedirect = useCallback(() => {
    window.location.href = getLoginRedirectUrl();
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post(LOGOUT_ENDPOINT);
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
