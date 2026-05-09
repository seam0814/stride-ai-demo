"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand)] grid place-items-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">Stride</div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[var(--muted-fg)] mt-0.5">AI Running Analysis</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px]">
          <Link href="/analyze" className="text-[var(--foreground)]/75 hover:text-[var(--foreground)]">영상 분석</Link>
          <Link href="/label" className="text-[var(--foreground)]/75 hover:text-[var(--foreground)]">음성 라벨링</Link>
          <Link href="/results" className="text-[var(--foreground)]/75 hover:text-[var(--foreground)]">분석 이력</Link>
          <Link href="/api-docs" className="text-[var(--foreground)]/75 hover:text-[var(--foreground)]">API 문서</Link>
        </nav>

        <Link
          href="/analyze"
          className="text-[12px] bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] px-4 py-2 rounded-full font-medium transition-colors"
        >
          분석 시작
        </Link>
      </div>
    </header>
  );
}
