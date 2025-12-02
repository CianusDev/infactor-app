"use client";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn, getErrorMessage } from "@/lib/utils";
import { forwardRef } from "react";
import { ZodIssue } from "zod";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  description?: string;
  errors?: ZodIssue[];
  labelClassName?: string;
  wrapperClassName?: string;
  labelRight?: React.ReactNode;
  hideLabel?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      description,
      errors,
      labelClassName,
      wrapperClassName,
      labelRight,
      hideLabel = false,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const error = getErrorMessage(errors, props.name || "");
    // console.log("Rendering FormInput:", {
    //   inputId,
    //   error,
    //   errors,
    //   name: props.name,
    // });
    return (
      <Field className={wrapperClassName} data-invalid={!!error}>
        <div
          className={cn("flex items-center", labelRight && "justify-between")}
        >
          <FieldLabel
            htmlFor={inputId}
            className={cn(hideLabel && "sr-only", labelClassName)}
          >
            {label}
          </FieldLabel>
          {labelRight}
        </div>
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && "border-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : description
                ? `${inputId}-description`
                : undefined
          }
          {...props}
        />
        {description && !error && (
          <FieldDescription id={`${inputId}-description`}>
            {description}
          </FieldDescription>
        )}
        {error && <FieldError id={`${inputId}-error`}>{error}</FieldError>}
      </Field>
    );
  },
);

FormInput.displayName = "FormInput";
