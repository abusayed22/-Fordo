"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Store,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
} from "lucide-react";

export default function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!emailOrPhone) {
      setErrorMessage("Please enter your registered email address or phone.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="py-8 sm:py-14 px-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="size-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="size-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Instructions Sent!
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                We have sent a verification code &amp; password reset link to{" "}
                <strong className="text-slate-800">{emailOrPhone}</strong>.
              </p>
            </div>

            <div className="pt-3 space-y-2 text-xs">
              <Link
                href={`/email-verification?email=${encodeURIComponent(emailOrPhone)}`}
                className="w-full py-2.5 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <span>Enter Verification Code</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
              >
                Try different email
              </button>
            </div>
          </div>
        ) : (
          /* Forgot Password Request Form */
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#056D6E] mx-auto shadow-2xs">
                <KeyRound className="size-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
                Forgot Password?
              </h1>
              <p className="text-xs text-slate-500">
                Enter your registered email or phone number and we&apos;ll send you a recovery code.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registered Email or Phone *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 017xxxxxxxx"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin text-white" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
