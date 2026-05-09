"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleLabels, SAMPLE_VIDEOS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Wand2, Save, Volume2, AlertCircle, ArrowRight } from "lucide-react";

const LABEL_STAGES = ["raw", "corrected", "structured", "saved"] as const;
type LabelStage = (typeof LABEL_STAGES)[number];

export default function LabelPage() {
  const [stage, setStage] = useState<LabelStage>("raw");
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [showStructured, setShowStructured] = useState(false);
  const sample = sampleLabels[0];
  const recRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => recRef.current?.stop?.(), []);

  const runDemo = () => {
    // Animate from raw → corrected → structured
    setStage("raw");
    setText("");
    setShowStructured(false);
    let i = 0;
    const tick = () => {
      if (i < sample.raw.length) {
        setText(sample.raw.slice(0, i + 1));
        i++;
        setTimeout(tick, 30);
      } else {
        setTimeout(() => {
          setStage("corrected");
          setText(sample.corrected);
          setTimeout(() => {
            setStage("structured");
            setShowStructured(true);
          }, 1200);
        }, 400);
      }
    };
    tick();
  };

  const startRecording = () => {
    if (typeof window === "undefined") return;
    type SpeechRecognitionConstructor = new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    };
    const w = window as unknown as {
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
      SpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Edge에서 시연하시거나 [샘플 시연]을 사용해 주세요.");
      return;
    }
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => setText(e.results[0][0].transcript);
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="eyebrow">의사 음성 라벨링 툴</span>
        <h1 className="display text-[28px] md:text-[34px] mt-2">영상 보면서 말로 소견 입력</h1>
        <p className="text-[13px] text-[var(--muted-fg)] mt-1">
          마이크로 말씀하시면 Whisper로 변환 → GPT-4o-mini가 의학 용어를 교정하고
          위험도·이상부위·처방 항목으로 자동 정형화합니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        {/* Left: Video + recording */}
        <div className="space-y-4">
          <Card className="overflow-hidden !p-0">
            <div className="aspect-[16/10] relative bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SAMPLE_VIDEOS[0].img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-[11px] font-medium text-white">환자 #240128 · 측면 영상</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur p-3 rounded-lg flex items-center gap-3">
                <span className="text-[11px] text-white/70">00:14 / 00:42</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: "33%" }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold display flex items-center gap-2">
                <Mic className="w-4 h-4 text-[var(--brand)]" /> 음성 입력
              </h2>
              <Badge variant={recording ? "danger" : "neutral"}>
                {recording ? "녹음 중" : "대기"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={startRecording} disabled={recording}>
                {recording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {recording ? "녹음 중..." : "마이크로 입력"}
              </Button>
              <Button onClick={runDemo} variant="outline">
                <Wand2 className="w-3.5 h-3.5" /> 샘플 시연
              </Button>
            </div>

            <p className="text-[11px] text-[var(--muted-fg)] mt-3 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              브라우저 STT(Web Speech API)는 데모용. 실제 납품 시 Whisper API로 정확도 ↑
            </p>
          </Card>
        </div>

        {/* Right: STT → LLM pipeline */}
        <div className="space-y-3">
          {/* Stage 1: Raw STT */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--surface)] grid place-items-center text-[10px] font-bold text-[var(--muted-fg)]">1</span>
                <span className="text-[12px] font-medium">STT 원본 (Whisper)</span>
              </div>
              <Badge variant={text ? "info" : "neutral"}>
                {text ? "변환 완료" : "대기"}
              </Badge>
            </div>
            <div className="bg-[var(--surface)] rounded-lg p-3 min-h-[80px] text-[13px] leading-relaxed">
              {text || <span className="text-[var(--muted-fg)]/60">음성을 입력하시거나 [샘플 시연]을 눌러주세요</span>}
              {stage === "raw" && text && <span className="inline-block w-2 h-4 bg-[var(--brand)] ml-0.5 animate-pulse" />}
            </div>
          </Card>

          {/* Stage 2: LLM corrected */}
          <Card className={cn("p-5 transition-opacity", stage === "raw" && !showStructured ? "opacity-40" : "")}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--surface)] grid place-items-center text-[10px] font-bold text-[var(--muted-fg)]">2</span>
                <span className="text-[12px] font-medium">의학 용어 교정 (GPT-4o-mini)</span>
              </div>
              <Badge variant={stage === "corrected" || stage === "structured" || stage === "saved" ? "success" : "neutral"}>
                {stage === "corrected" || stage === "structured" || stage === "saved" ? "교정 완료" : "대기"}
              </Badge>
            </div>
            <div className="bg-[var(--brand-light)] rounded-lg p-3 min-h-[80px] text-[13px] leading-relaxed text-[var(--brand-dark)]">
              {stage === "corrected" || stage === "structured" || stage === "saved" ? sample.corrected : <span className="text-[var(--muted-fg)]/60">교정된 내용이 표시됩니다</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
              <Badge variant="brand">오타 교정 3건</Badge>
              <Badge variant="brand">의학 용어 정렬</Badge>
              <Badge variant="brand">문장 분리</Badge>
            </div>
          </Card>

          {/* Stage 3: Structured */}
          <Card className={cn("p-5 transition-opacity", showStructured ? "" : "opacity-40")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--surface)] grid place-items-center text-[10px] font-bold text-[var(--muted-fg)]">3</span>
                <span className="text-[12px] font-medium">정형화 (DB 저장 형식)</span>
              </div>
              <Badge variant={stage === "structured" || stage === "saved" ? "success" : "neutral"}>
                {stage === "structured" || stage === "saved" ? "추출 완료" : "대기"}
              </Badge>
            </div>
            {showStructured ? (
              <div className="space-y-2 text-[12px]">
                <Field label="위험도" value={`${sample.structured.risk}%`} highlight />
                <Field label="이상 부위" value={sample.structured.region} />
                <Field label="진단 요약" value={sample.structured.diagnosis} />
                <Field label="처방" value={sample.structured.prescription} />
              </div>
            ) : (
              <div className="text-[12px] text-[var(--muted-fg)]/60 py-2">정형화된 항목이 표시됩니다</div>
            )}
          </Card>

          {showStructured && (
            <Button className="w-full" onClick={() => setStage("saved")}>
              <Save className="w-3.5 h-3.5" /> {stage === "saved" ? "저장됨 ✓" : "DB에 라벨 저장"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-3">
        <InfoCard title="Whisper API" desc="다국어 한국어 인식 + 전문 용어 풀에 적응 (Custom Vocabulary)" />
        <InfoCard title="GPT-4o-mini" desc="의학 용어 교정 + 함수 호출(JSON Schema)로 항목 자동 정형화" />
        <InfoCard title="DB 스키마" desc="risk · region · diagnosis · prescription · raw_audio · timestamp" />
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/analyze"><Button variant="outline">분석 페이지로 <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-[var(--border)] last:border-b-0">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)] w-20 shrink-0 mt-0.5">{label}</span>
      <span className={cn("flex-1 leading-relaxed", highlight ? "text-rose-700 font-semibold" : "")}>{value}</span>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Volume2 className="w-3.5 h-3.5 text-[var(--brand)]" />
        <span className="text-[12px] font-medium">{title}</span>
      </div>
      <p className="text-[11px] text-[var(--muted-fg)] leading-relaxed">{desc}</p>
    </Card>
  );
}
