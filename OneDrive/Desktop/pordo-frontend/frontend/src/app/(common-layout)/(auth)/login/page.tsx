"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/context/role-context";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Phone,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [emailOrPhone, setEmailOrPhone] = useState("sayed@pordo.com");
  const [password, setPassword] = useState("pordo@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!emailOrPhone || !password) {
      setErrorMessage("Please enter both email/phone and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setRole(selectedRole);

      if (selectedRole === "CUSTOMER") {
        router.push("/");
      } else if (selectedRole === "MANUAL_ORDER_ENTRY") {
        router.push("/orders/new");
      } else {
        router.push("/dashboard");
      }
    }, 900);
  };

  const handleQuickDemo = (role: UserRole, email: string) => {
    setSelectedRole(role);
    setEmailOrPhone(email);
    setPassword("pordo@2026");
  };

  return (
    <div className="py-8 sm:py-14 px-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#056D6E] mx-auto shadow-2xs">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your orders, wishlist, and dashboard
          </p>
        </div>

        {/* Quick Demo Role Switcher Pills for Testing */}
        <div className="mb-5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>Quick Demo Login As:</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-semibold">
              Instant Fill
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemo("CUSTOMER", "customer@pordo.com")}
              className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedRole === "CUSTOMER"
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("ADMIN", "admin@pordo.com")}
              className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedRole === "ADMIN"
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("MANAGER", "manager@pordo.com")}
              className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedRole === "MANAGER"
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Manager
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Email or Phone */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Email or Phone Number *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="you@example.com or 017xxxxxxxx"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Password *</label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-[#056D6E] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10.5 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded text-[#056D6E] focus:ring-0 cursor-pointer"
              />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="size-4 animate-spin text-white" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Social / Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => alert("Google Login connected in live mode.")}
            className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.8 5.6 6.5 10.1 6.5z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Facebook Login connected in live mode.")}
            className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="size-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-[#056D6E] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
