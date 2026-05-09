"use client";

import Link from "next/link";
import { pastAnalyses } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

export default function ResultsPage() {
  const avgRisk = Math.round(pastAnalyses.reduce((s, a) => s + a.overallRisk, 0) / pastAnalyses.length);
  const trend = pastAnalyses[0].overallRisk - pastAnalyses[pastAnalyses.length - 1].overallRisk;

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="eyebrow">분석 이력</span>
        <h1 className="display text-[28px] md:text-[34px] mt-2">총 {pastAnalyses.length}건의 분석 기록</h1>
        <p className="text-[13px] text-[var(--muted-fg)] mt-1">
          영상별 위험도 변화를 추적하여 부상 예방 트레이닝 효과를 측정합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="평균 위험도" value={`${avgRisk}`} unit="/100" />
        <StatCard label="최근 변화" value={`${trend > 0 ? "+" : ""}${trend}`} unit="pt" trend={trend > 0 ? "up" : "down"} />
        <StatCard label="가장 흔한 위험 부위" value="우측 슬개대퇴" small />
        <StatCard label="총 영상 시간" value="2:53" unit="" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pastAnalyses.map((a) => (
          <Card key={a.id} className="overflow-hidden hover:border-[var(--brand)] transition-colors">
            <div className="flex">
              <div className="w-32 shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.thumb} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0" />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-baseline justify-between mb-2 gap-2">
                  <span className="text-[11px] text-[var(--muted-fg)]">{formatDate(a.date)}</span>
                  <div className="flex gap-1">
                    {a.views.map((v) => (
                      <Badge key={v} variant="info" className="!text-[10px]">
                        {v === "front" ? "정면" : v === "side" ? "측면" : "후면"}
                      </Badge>
                    ))}
                  </div>
                </div>
                <h3 className="text-[14px] font-medium mb-2">{a.videoLabel}</h3>
                <div className="flex items-baseline gap-3 mb-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--muted-fg)]">위험도</div>
                    <div className={cn(
                      "display text-[22px] tabular-nums",
                      a.overallRisk >= 70 ? "text-rose-700" : a.overallRisk >= 50 ? "text-amber-700" : "text-emerald-700",
                    )}>{a.overallRisk}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--muted-fg)]">주요 부위</div>
                    <div className="text-[12px] font-medium">{a.topZone}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-fg)]">분석 #{a.id.toUpperCase()} · {a.duration}</span>
                  <Link href="/analyze" className="text-[11px] text-[var(--brand)] font-medium inline-flex items-center gap-1">
                    상세 보기 <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit = "", trend, small }: { label: string; value: string; unit?: string; trend?: "up" | "down"; small?: boolean }) {
  return (
    <Card className="p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)]">{label}</div>
      <div className={cn("display tabular-nums mt-1.5 flex items-baseline gap-1.5", small ? "text-[16px]" : "text-[28px]")}>
        <span>{value}</span>
        {unit && <span className="text-[var(--muted-fg)] text-[14px]">{unit}</span>}
        {trend === "up" && <TrendingUp className="w-4 h-4 text-rose-500 ml-1" />}
        {trend === "down" && <TrendingDown className="w-4 h-4 text-emerald-500 ml-1" />}
      </div>
    </Card>
  );
}
