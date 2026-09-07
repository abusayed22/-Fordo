"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Building2,
} from "lucide-react";

export default function Register() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validation
  const passwordChecks = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.minLength) score += 1;
    if (passwordChecks.hasNumber) score += 1;
    if (passwordChecks.hasUpper) score += 1;
    if (passwordChecks.hasSpecial) score += 1;
    return score;
  }, [passwordChecks]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !phone || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to email verification
      router.push(`/email-verification?email=${encodeURIComponent(email)}`);
    }, 1100);
  };

  return (
    <div className="py-8 sm:py-14 px-4 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#056D6E] mx-auto shadow-2xs">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            Create an Account
          </h1>
          <p className="text-xs text-slate-500">
            Join Pordo for exclusive discounts, express orders &amp; rewards
          </p>
        </div>

        {/* Account Type Selector */}
        <div className="mb-5 grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setAccountType("CUSTOMER")}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              accountType === "CUSTOMER"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="size-3.5" />
            <span>Shopper / Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType("VENDOR")}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              accountType === "VENDOR"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="size-3.5" />
            <span>Merchant / Vendor</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Abu Sayed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="01700112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10.5 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10.5 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Match Status */}
          {confirmPassword && (
            <p className="text-[11px] flex items-center gap-1">
              {passwordsMatch ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-500 font-medium">Passwords do not match</span>
              )}
            </p>
          )}

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none text-slate-600 leading-snug">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="size-4 mt-0.5 rounded text-[#056D6E] focus:ring-0 cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <Link href="/" className="font-bold text-[#056D6E] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="font-bold text-[#056D6E] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-3"
          >
            {isLoading ? (
              <>
                <RefreshCw className="size-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#056D6E] hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
