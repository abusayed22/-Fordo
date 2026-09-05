"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Store,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "user@pordo.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(45);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle Paste
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setErrorMessage("Please enter the full 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    alert(`A new verification code has been resent to ${emailParam}`);
  };

  return (
    <div className="py-8 sm:py-14 px-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {isSuccess ? (
          /* Success State */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="size-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Email Verified Successfully!
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your account is now fully verified and activated. Welcome to Pordo Mart!
              </p>
            </div>

            <div className="pt-3 space-y-2 text-xs">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/"
                className="block text-center text-slate-500 hover:text-slate-800 font-semibold py-1"
              >
                Continue to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* OTP Input Form */
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#056D6E] mx-auto shadow-2xs">
                <Mail className="size-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
                Verify Your Email
              </h1>
              <p className="text-xs text-slate-500">
                We sent a 6-digit security code to: <br />
                <strong className="text-slate-900 font-semibold">{emailParam}</strong>
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-5 text-xs">
              {/* 6 Digit OTP Boxes */}
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="size-11 sm:size-12 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-lg text-slate-900 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all shadow-2xs"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin text-white" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Activate Account</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            {/* Resend Timer & Links */}
            <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
              <p>
                Didn&apos;t receive the code?{" "}
                {resendTimer > 0 ? (
                  <span className="font-semibold text-slate-400">
                    Resend in <strong className="font-mono text-slate-700">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-bold text-[#056D6E] hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/login"
                  className="font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading verification...</div>}>
      <EmailVerificationForm />
    </Suspense>
  );
}
