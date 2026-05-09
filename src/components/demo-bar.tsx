"use client";

import { useStride } from "./state-provider";
import type { DemoStage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stages: { id: DemoStage; label: string }[] = [
  { id: "idle", label: "영상 미업로드" },
  { id: "analyzing", label: "분석 중" },
  { id: "complete", label: "분석 완료" },
];

export function DemoBar() {
  const { stage, setStage } = useStride();
  return (
    <div className="bg-[#0f172a] text-slate-200 text-xs">
      <div className="max-w-[1280px] mx-auto px-6 py-2 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.18em] text-sky-300 font-semibold">
            데모 시점
          </span>
          <div className="flex flex-wrap gap-1">
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                  stage === s.id ? "bg-white text-[#0f172a]" : "bg-white/5 text-slate-300 hover:bg-white/10",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-[10px] text-slate-400 hidden sm:block">
          /analyze 페이지에서 시점 전환이 즉시 반영됩니다
        </span>
      </div>
    </div>
  );
}
