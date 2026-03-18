"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { publicAuthService } from "@/services/public/publicAuth.service";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ studioSlug, children }) {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadMember = useCallback(async () => {
    try {
      const token = localStorage.getItem("memberAccessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const { data } = await publicAuthService.getMe(studioSlug);
      setMember(data.data);
    } catch {
      localStorage.removeItem("memberAccessToken");
      localStorage.removeItem("memberRefreshToken");
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }, [studioSlug]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  const sendOtp = useCallback(
    async (phone) => {
      const { data } = await publicAuthService.sendOtp(studioSlug, phone);
      return data;
    },
    [studioSlug],
  );

  const verifyOtp = useCallback(
    async (phone, code) => {
      const { data } = await publicAuthService.verifyOtp(studioSlug, phone, code);
      localStorage.setItem("memberAccessToken", data.data.accessToken);
      localStorage.setItem("memberRefreshToken", data.data.refreshToken);
      setMember(data.data.member);
      return data;
    },
    [studioSlug],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("memberAccessToken");
    localStorage.removeItem("memberRefreshToken");
    setMember(null);
    router.push(`/book/${studioSlug}`);
  }, [studioSlug, router]);

  const requireAuth = useCallback(() => {
    if (!member && !isLoading) {
      router.push(`/book/${studioSlug}/login?redirect=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  }, [member, isLoading, router, studioSlug, pathname]);

  const value = {
    member,
    isAuthenticated: !!member,
    isLoading,
    studioSlug,
    sendOtp,
    verifyOtp,
    logout,
    requireAuth,
    refreshMember: loadMember,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
