import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@base-ui/react/input";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return String(error);
};

type AppFieldProps = {
  field: AnyFieldApi;
  label?: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  disabled = false,
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label
          htmlFor={field.name}
          className={cn("block font-bold text-slate-700 text-xs", hasError && "text-destructive")}
        >
          {label}
        </Label>
      )}

      <div className="relative">
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 z-10">
            {prepend}
          </div>
        )}

        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value ?? ""}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            "w-full h-11 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium",
            prepend ? "pl-10" : "pl-3",
            append ? "pr-10" : "pr-3",
            hasError && "border-rose-400 focus:border-rose-500"
          )}
        />

        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
            {append}
          </div>
        )}
      </div>

      {hasError && (
        <p
          id={`${field.name}-error`}
          role="alert"
          className="text-rose-500 text-[11px] mt-1 font-medium"
        >
          {firstError}
        </p>
      )}
    </div>
  );
};

export default AppField;