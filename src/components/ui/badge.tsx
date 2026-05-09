import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-[var(--surface)] text-[var(--muted-fg)] border-[var(--border)]",
  brand: "bg-[var(--brand-light)] text-[var(--brand-dark)] border-[var(--brand)]/15",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  danger: "bg-red-50 text-red-900 border-red-200",
  info: "bg-sky-50 text-sky-900 border-sky-200",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { variant?: Variant };

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", variantClasses[variant], className)}
      {...props}
    />
  );
}
