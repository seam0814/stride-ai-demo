"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PoseOverlay } from "@/components/pose-overlay";
import { Activity, Mic, Zap, Code, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <span className="eyebrow">AI 달리기 자세 분석</span>
            <h1 className="display mt-5 text-[36px] md:text-[52px] leading-[1.05] text-[var(--foreground)]">
              스마트폰 영상으로<br />
              <span className="text-[var(--brand)]">달리기 부상을 예측</span>합니다.
            </h1>
            <p className="mt-6 text-[15px] text-[var(--muted-fg)] max-w-md leading-relaxed">
              MediaPipe로 관절을 추출하고, 의사 음성 라벨을 학습한 룰 기반 모델이
              부상 위험도와 교정 처방을 자동 산출합니다. 30초 영상 → 즉시 결과.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/analyze">
                <Button size="lg">영상 분석 시작 <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link href="/label">
                <Button variant="ghost" size="lg">의사 라벨링 툴 보기</Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-[12px] text-[var(--muted-fg)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> MediaPipe Pose
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> Whisper STT
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> GPT-4o-mini
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> FastAPI
              </span>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
              <PoseOverlay />

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-[var(--border)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-[11px] font-medium">실시간 추론</span>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-[10px] uppercase tracking-[0.18em] text-rose-700 font-semibold">주의</div>
                <div className="text-[13px] font-medium mt-0.5">우측 슬개대퇴</div>
                <div className="text-[11px] text-[var(--muted-fg)]">위험도 72%</div>
              </div>

              <div className="absolute top-4 right-4 bg-[#0f172a]/90 backdrop-blur px-3 py-2 rounded-lg text-white">
                <div className="text-[10px] uppercase tracking-wider opacity-70">cadence</div>
                <div className="text-[15px] font-semibold font-mono">168 spm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="md:flex md:items-baseline md:justify-between mb-12 gap-8">
          <h2 className="display text-[28px] md:text-[36px] leading-tight">
            오픈소스 + 상용 API의<br />가성비 조합
          </h2>
          <p className="text-[13px] text-[var(--muted-fg)] max-w-sm mt-2 md:mt-0 leading-relaxed">
            자체 모델 학습 없이도 신뢰할 만한 결과를 산출합니다.
            <br />각 단계는 독립적으로 모니터링·교체 가능한 구조입니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
          <Pillar n="01" icon={Mic} title="음성 라벨링" desc="원장님이 영상 보며 말로 소견 입력 → Whisper STT → GPT-4o-mini가 의학 용어 교정 + 항목 정형화" />
          <Pillar n="02" icon={Activity} title="자세 추출" desc="MediaPipe Pose로 33개 관절 2D/3D 좌표 추출. 노이즈 필터링 후 보폭·체공·관절각 계산" />
          <Pillar n="03" icon={Zap} title="위험도 추론" desc="추출 지표 + 라벨 데이터를 룰 기반 모델로 매핑. 위험도 점수 + 이상 부위 + 교정 처방 출력" />
          <Pillar n="04" icon={Code} title="API 서빙" desc="FastAPI로 영상 입력 → JSON 결과 반환. Token 인증, 모바일 앱이 그대로 호출 가능" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-6 pb-20">
        <div className="bg-[#0f172a] text-white rounded-2xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--brand)]/30 blur-3xl" aria-hidden />
          <div className="relative grid md:grid-cols-2 gap-6 items-end">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sky-300 font-semibold">데모 시연</span>
              <h2 className="display text-[28px] md:text-[40px] leading-[1.05] mt-3">
                상단 &quot;데모 시점&quot; 토글로<br />
                <span className="text-[var(--accent)]">분석 전·중·후</span>를 즉시 체험
              </h2>
            </div>
            <div className="md:text-right">
              <p className="text-slate-400 text-[13px] max-w-sm md:ml-auto mb-6 leading-relaxed">
                평가자가 &quot;분석 중 → 분석 완료&quot; 흐름을 클릭 한 번에 확인할 수 있도록 구성했습니다.
              </p>
              <Link href="/analyze">
                <Button className="bg-white !text-[#0f172a] hover:bg-slate-100" size="lg">
                  영상 분석 화면 <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pillar({ n, icon: Icon, title, desc }: { n: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; desc: string }) {
  return (
    <div className="bg-[var(--background)] p-6">
      <div className="flex items-center justify-between mb-8">
        <Icon className="w-5 h-5 text-[var(--brand)]" strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)] font-semibold">{n}</span>
      </div>
      <h3 className="text-[15px] font-medium mb-2 display">{title}</h3>
      <p className="text-[12px] text-[var(--muted-fg)] leading-relaxed">{desc}</p>
    </div>
  );
}
