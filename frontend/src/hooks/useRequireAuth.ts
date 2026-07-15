"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

/**
 * Reusable hook that provides an auth gate for protected actions.
 *
 * Usage:
 *   const { requireAuth } = useRequireAuth();
 *   if (!requireAuth()) return;  // shows toast + redirects if not logged in
 *   // proceed with protected action
 */
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const requireAuth = useCallback(() => {
    if (loading) return false;
    if (isAuthenticated) return true;

    toast.warning("Please login or register to add items to your cart.");
    setTimeout(() => {
      router.push("/login");
    }, 1500);

    return false;
  }, [isAuthenticated, loading, router]);

  return { requireAuth };
}
