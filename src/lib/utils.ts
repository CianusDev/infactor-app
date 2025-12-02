import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(errors: ZodIssue[] | null, field: string) {
  return errors?.find((e) => e.path[0] === field)?.message;
}

export function prepareDataApi(status: number, data: unknown, error: string) {
  switch (status) {
    case 200:
    case 201:
      return {
        success: true,
        data: data,
      };
    default:
      return {
        success: false,
        message: error,
      };
  }
}
