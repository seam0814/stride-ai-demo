"use client";

import { useState } from "react";
import Link from "next/link";
import { useStride } from "@/components/state-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PoseOverlay } from "@/components/pose-overlay";
import {
  SAMPLE_VIDEOS,
  sampleMetrics,
  riskZones,
  overallRisk,
  prescriptions,
  type Metric,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  ArrowRight,
  Activity,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  Dumbbell,
  Lightbulb,
  StretchHorizontal,
} from "lucide-react";

const PRESCRIPTION_ICONS = {
  drill: Activity,
  stretch: StretchHorizontal,
  strength: Dumbbell,
  tip: Lightbulb,
};

export default function AnalyzePage() {
  const { stage, setStage } = useStride();
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEOS[0]);
  const [analyzing, setAnalyzing] = useState(false);

  const startAnalysis = () => {
    setStage("analyzing");
    setAnalyzing(true);
    setTimeout(() => {
      setStage("complete");
      setAnalyzing(false);
    }, 2800);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="eyebrow">영상 분석</span>
        <h1 className="display text-[28px] md:text-[34px] mt-2">달리기 영상 → 부상 위험도 진단</h1>
        <p className="text-[13px] text-[var(--muted-fg)] mt-1">
          전·후·측면 30초 이상의 달리기 영상을 업로드하시면, MediaPipe로 관절을 추출하고
          룰 기반 추론으로 위험도와 처방을 산출합니다.
        </p>
      </div>

      {/* Top: video + metrics */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Video panel */}
        <Card className="overflow-hidden !p-0">
          {stage === "idle" && !analyzing && (
            <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 grid place-items-center p-8">
              <div className="text-center max-w-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-[var(--brand-light)] grid place-items-center mb-4">
                  <UploadCloud className="w-6 h-6 text-[var(--brand)]" strokeWidth={1.5} />
                </div>
                <h2 className="display text-[20px] mb-2">영상을 업로드하거나<br />샘플로 시작하세요</h2>
                <p className="text-[12px] text-[var(--muted-fg)] mb-5 leading-relaxed">
                  지원 포맷: MP4 / MOV · 권장 해상도 1080p · 권장 프레임레이트 30fps 이상
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <label className="inline-flex">
                    <Button variant="outline" size="md">
                      <UploadCloud className="w-3.5 h-3.5" /> 파일 선택
                    </Button>
                    <input type="file" accept="video/*" className="hidden" />
                  </label>
                  <Button onClick={startAnalysis}>
                    <Wand2 className="w-3.5 h-3.5" /> 샘플로 분석 시작
                  </Button>
                </div>
              </div>
            </div>
          )}

          {(stage === "analyzing" || analyzing) && (
            <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedVideo.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <PoseOverlay active={true} />

              {/* Scan line */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_20px_rgba(56,189,248,0.7)] animate-scan" />

              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-soft" />
                <span className="text-[11px] font-medium text-white">분석 진행 중...</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <Stat label="프레임 처리" value="32" total="84" />
                  <Stat label="키포인트" value="33" total="33" />
                  <Stat label="신뢰도" value="0.94" />
                </div>
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 animate-pulse-soft" style={{ width: "62%" }} />
                </div>
              </div>
            </div>
          )}

          {stage === "complete" && !analyzing && (
            <div className="aspect-[16/10] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedVideo.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <PoseOverlay active={true} />

              <div className="absolute top-4 left-4 bg-emerald-500/95 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-2 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">분석 완료</span>
              </div>

              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted-fg)]">VIEW</div>
                <div className="text-[12px] font-semibold">{selectedVideo.label}</div>
              </div>

              <div className="absolute bottom-4 right-4 bg-rose-500/95 backdrop-blur px-4 py-3 rounded-lg text-white">
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold">위험 부위</div>
                <div className="text-[14px] font-semibold mt-0.5">우측 슬개대퇴</div>
              </div>
            </div>
          )}

          {/* Sample selector */}
          <div className="border-t border-[var(--border)] p-4 bg-[var(--surface)]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)] mb-2.5">샘플 영상</div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className={cn(
                    "aspect-video rounded-md overflow-hidden relative border-2 transition-all",
                    selectedVideo.id === v.id ? "border-[var(--brand)]" : "border-transparent hover:border-[var(--border-strong)]",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-1 left-1.5 text-[10px] text-white font-medium">{v.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Risk meter + zones */}
        <div className="space-y-4">
          {stage === "complete" ? (
            <>
              <Card className="p-6 bg-gradient-to-br from-rose-50 to-amber-50 border-rose-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-rose-700 font-semibold">종합 위험도</span>
                  <Badge variant="warning"><AlertTriangle className="w-3 h-3" /> 주의</Badge>
                </div>
                <RiskMeter score={overallRisk} />
              </Card>

              <Card className="p-6">
                <h2 className="text-[14px] font-semibold display mb-4">이상 부위</h2>
                <div className="space-y-3">
                  {riskZones.map((z, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium">{z.name}</span>
                        <span className={cn("text-[12px] font-semibold tabular-nums", z.risk >= 70 ? "text-rose-700" : z.risk >= 50 ? "text-amber-700" : "text-emerald-700")}>
                          {z.risk}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            z.risk >= 70 ? "bg-rose-500" : z.risk >= 50 ? "bg-amber-500" : "bg-emerald-500",
                          )}
                          style={{ width: `${z.risk}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[var(--muted-fg)] mt-1.5 leading-relaxed">{z.reason}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-6 h-full grid place-items-center text-center">
              <div>
                <Activity className="w-8 h-8 text-[var(--muted-fg)]/40 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-[13px] text-[var(--muted-fg)]">
                  분석 완료 시<br />위험도 카드가 여기에 표시됩니다
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Metrics + Prescription */}
      {stage === "complete" && (
        <>
          <Card className="p-6 mb-6">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="display text-[18px]">생체역학 지표</h2>
              <span className="text-[11px] text-[var(--muted-fg)]">MediaPipe 33-keypoint 기반 산출</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleMetrics.map((m) => <MetricCard key={m.key} m={m} />)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="display text-[18px]">교정 처방</h2>
              <span className="text-[11px] text-[var(--muted-fg)]">의사 라벨 + 룰 기반 매칭</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prescriptions.map((p, i) => {
                const Icon = PRESCRIPTION_ICONS[p.category];
                const labels = { drill: "드릴", stretch: "스트레칭", strength: "근력", tip: "팁" };
                return (
                  <div key={i} className="bg-[var(--surface)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.5} />
                      <Badge variant="info">{labels[p.category]}</Badge>
                    </div>
                    <h3 className="text-[14px] font-medium mb-1">{p.title}</h3>
                    <p className="text-[12px] text-[var(--muted-fg)] leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Link href="/results"><Button variant="outline">분석 이력 보기</Button></Link>
            <Link href="/api-docs"><Button variant="outline">API로 호출하기 <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, total }: { label: string; value: string; total?: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/60">{label}</div>
      <div className="text-white font-mono text-[14px] mt-0.5 tabular-nums">
        {value}
        {total && <span className="text-white/40"> / {total}</span>}
      </div>
    </div>
  );
}

function RiskMeter({ score }: { score: number }) {
  const angle = (score / 100) * 180;
  const color = score >= 70 ? "#dc2626" : score >= 50 ? "#f59e0b" : "#10b981";

  return (
    <div className="relative">
      <svg viewBox="0 0 200 110" className="w-full">
        <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#e2e8f0" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="251.3"
          strokeDashoffset={251.3 - (251.3 * angle) / 180}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <div className="display text-[44px] leading-none tabular-nums" style={{ color }}>{score}</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)] mt-1">/ 100</div>
      </div>
    </div>
  );
}

function MetricCard({ m }: { m: Metric }) {
  const colors = {
    normal: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-rose-200 bg-rose-50",
  };
  const dot = {
    normal: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };
  return (
    <div className={cn("rounded-lg border p-4", colors[m.status])}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] uppercase tracking-wider text-[var(--muted-fg)]">{m.label}</span>
        <span className={cn("w-1.5 h-1.5 rounded-full", dot[m.status])} />
      </div>
      <div className="display text-[24px] tabular-nums">
        {m.value}
        {m.unit && <span className="text-[14px] text-[var(--muted-fg)] ml-1">{m.unit}</span>}
      </div>
      <div className="text-[10px] text-[var(--muted-fg)] mt-1">{m.reference}</div>
      <p className="text-[11px] text-[var(--foreground)]/70 mt-2 leading-relaxed">{m.desc}</p>
    </div>
  );
}
