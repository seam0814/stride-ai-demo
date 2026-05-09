import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-[var(--card)] border border-[var(--border)] rounded-xl", className)} {...props} />;
}
