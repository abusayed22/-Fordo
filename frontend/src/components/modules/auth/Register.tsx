"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { IRegisterPayload, registerZodSchema } from "@/zodValidation/auth.validation";
import AppField from "@/shared/AppFeild";
import { AppSubmitButton } from "@/shared/AppButton";
import { registerAction } from "@/app/(common-layout)/(auth)/register/_actions";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      try {
        const res = (await mutateAsync(value)) as any;
        if (!res?.success) {
          setErrorMessage(res?.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Registration failed");
      }
    },
  });

  return (
    <div className="py-8 sm:py-14 px-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#056D6E] to-teal-500" />

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#056D6E] mx-auto shadow-2xs">
            <UserPlus className="size-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            Create Account
          </h1>
          <p className="text-xs text-slate-500">
            Sign up to get started with your new account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4 text-xs"
        >
          {/* Name Field */}
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name *"
                type="text"
                placeholder="John Doe"
                prepend={<User className="size-4" />}
              />
            )}
          </form.Field>

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email *"
                type="email"
                placeholder="you@example.com"
                prepend={<Mail className="size-4" />}
              />
            )}
          </form.Field>

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password *"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                prepend={<Lock className="size-4" />}
                append={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
            )}
          </form.Field>

          {/* Submit Button */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isLoading={isSubmitting || isPending}
                loadingText="Creating Account...."
                disabled={!canSubmit}
                fullWidth
                className="mt-2 h-11 bg-[#056D6E] hover:bg-[#045859] text-white rounded-xl font-bold"
              >
                Sign Up
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or register with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
          <button
            type="button"
            className="h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.8 5.6 6.5 10.1 6.5z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
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
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#056D6E] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}