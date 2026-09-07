"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Store,
  RefreshCw,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  // Form State
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password validation rules
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

  const getStrengthLabel = () => {
    if (!password) return { label: "", color: "bg-slate-200" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
    if (strengthScore <= 2) return { label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
    if (strengthScore === 3) return { label: "Good", color: "bg-blue-500", text: "text-blue-600" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
  };

  const strength = getStrengthLabel();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all required password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (strengthScore < 2) {
      setErrorMessage("Please choose a stronger password with at least 8 characters.");
      return;
    }

    setIsLoading(true);

    // Simulate API password reset call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Brand Logo */}
      <div className="mb-6 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-[#056D6E] to-[#044342] flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
            <Store className="size-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
              PORDO
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">
              Store &amp; Dashboard Management
            </span>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative subtle header line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="size-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Password Reset Successfully!
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your account password has been updated. You can now securely sign in with your new credentials.
              </p>
            </div>

            <div className="pt-3 space-y-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/"
                className="block text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Password Form */
          <div className="space-y-5">
            {/* Header Icon & Title */}
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mx-auto sm:mx-0">
                <KeyRound className="size-5 text-[#056D6E]" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Reset Account Password
              </h1>
              <p className="text-xs text-slate-500">
                Enter your reset security token and set a new secure password.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Reset Token / OTP */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Token / OTP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. PRD-839210 or paste token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs placeholder:font-sans placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">New Password *</label>
                  {password && (
                    <span className={`text-[10px] font-bold ${strength.text}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= step ? strength.color : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                      <span className={passwordChecks.minLength ? "text-emerald-600 font-semibold" : ""}>
                        ● 8+ Characters
                      </span>
                      <span className={passwordChecks.hasNumber ? "text-emerald-600 font-semibold" : ""}>
                        ● 1 Number (0-9)
                      </span>
                      <span className={passwordChecks.hasUpper ? "text-emerald-600 font-semibold" : ""}>
                        ● 1 Uppercase Letter
                      </span>
                      <span className={passwordChecks.hasSpecial ? "text-emerald-600 font-semibold" : ""}>
                        ● 1 Special Character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {confirmPassword && (
                  <p className="mt-1 text-[11px] flex items-center gap-1">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Passwords match perfectly
                      </span>
                    ) : (
                      <span className="text-rose-500">
                        Passwords do not match yet
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin text-slate-400" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link
                href="/dashboard"
                className="hover:text-slate-900 font-semibold transition-colors"
              >
                ← Back to Login
              </Link>
              <Link
                href="/"
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                Storefront
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Security notice */}
      <p className="mt-6 text-center text-[11px] text-slate-400 max-w-xs">
        Protected with 256-bit SSL encryption. Never share your password or reset token with anyone.
      </p>
    </div>
  );
}
