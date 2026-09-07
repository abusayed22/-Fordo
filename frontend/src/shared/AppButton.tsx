"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AnyFormApi } from "@tanstack/react-form";

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variant style for the button */
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  /** Size of the button */
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  /** Optional TanStack Form instance to dynamically track form state */
  formApi?: AnyFormApi;
  /** Explicit loading or submitting state */
  isLoading?: boolean;
  isSubmitting?: boolean;
  /** Text to show while loading/submitting */
  loadingText?: string;
  /** Optional text label (if not using children) */
  label?: React.ReactNode;
  /** Icon placed before text */
  leftIcon?: React.ReactNode;
  /** Icon placed after text */
  rightIcon?: React.ReactNode;
  /** Makes the button occupy 100% width of its container */
  fullWidth?: boolean;
}

export const AppSubmitButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      children,
      label,
      className,
      variant = "default",
      size = "default",
      formApi,
      isLoading = false,
      isSubmitting = false,
      loadingText = "Submitting...",
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      type = "submit",
      ...props
    },
    ref
  ) => {
    // Dynamically check loading from props or formApi state
    const formIsSubmitting = formApi?.state?.isSubmitting ?? false;
    const formCanSubmit = formApi?.state?.canSubmit ?? true;

    const isBusy = isLoading || isSubmitting || formIsSubmitting;
    const isDisabled = disabled || isBusy || (formApi ? !formCanSubmit : false);

    const content = label || children || "Submit";

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center w-full justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isBusy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>{loadingText || content}</span>
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{content}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </span>
        )}
      </Button>
    );
  }
);


// export default AppButton;
