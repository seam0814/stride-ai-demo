"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Lock, Server, Webhook } from "lucide-react";

const REQUEST_EXAMPLE = `curl -X POST https://api.stride.ai/v1/analyze \\
  -H "Authorization: Bearer $STRIDE_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "video=@running.mp4" \\
  -F "view=side" \\
  -F "patient_id=p_1024"`;

const RESPONSE_EXAMPLE = `{
  "analysis_id": "a_280f1d",
  "status": "complete",
  "duration_ms": 4218,
  "overall_risk": 65,
  "view": "side",
  "metrics": {
    "cadence_spm": 168,
    "stride_m": 1.42,
    "ground_contact_ms": 248,
    "knee_flex_deg": 138,
    "trunk_lean_deg": 12,
    "vertical_osc_cm": 9.4
  },
  "risk_zones": [
    {
      "name": "우측 슬개대퇴 통증 증후군",
      "region": "knee",
      "risk": 72,
      "reason": "큰 보폭 + 수직 진폭 과다 → 슬개골 충격 증가"
    }
  ],
  "prescriptions": [
    {
      "category": "drill",
      "title": "케이던스 +10 연습",
      "desc": "메트로놈 180bpm에 맞춰 5분 × 3세트"
    }
  ],
  "keypoints_url": "https://cdn.stride.ai/kp/a_280f1d.json"
}`;

export default function ApiDocsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="eyebrow">API 문서</span>
        <h1 className="display text-[28px] md:text-[34px] mt-2">REST API 명세</h1>
        <p className="text-[13px] text-[var(--muted-fg)] mt-1">
          영상 파일을 입력하면 분석 결과를 JSON으로 반환합니다. 모바일 앱·웹·외부 시스템에서 동일하게 호출 가능.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <InfoTile icon={Server} label="Base URL" value="api.stride.ai/v1" />
        <InfoTile icon={Lock} label="인증" value="Bearer Token" />
        <InfoTile icon={Code} label="포맷" value="JSON / multipart" />
        <InfoTile icon={Webhook} label="평균 응답" value="3.5s (60s 영상)" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="success">POST</Badge>
              <span className="font-mono text-[12px]">/analyze</span>
            </div>
            <span className="text-[10px] text-[var(--muted-fg)] uppercase tracking-wider">요청 예시</span>
          </div>
          <pre className="p-5 text-[11px] font-mono leading-relaxed overflow-x-auto bg-[#0f172a] text-slate-100">
{REQUEST_EXAMPLE}
          </pre>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="info">200 OK</Badge>
              <span className="font-mono text-[12px]">application/json</span>
            </div>
            <span className="text-[10px] text-[var(--muted-fg)] uppercase tracking-wider">응답 예시</span>
          </div>
          <pre className="p-5 text-[11px] font-mono leading-relaxed overflow-x-auto bg-[#0f172a] text-slate-100">
{RESPONSE_EXAMPLE}
          </pre>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="display text-[18px] mb-5">엔드포인트</h2>
        <div className="space-y-3">
          <Endpoint method="POST" path="/v1/analyze" desc="영상 업로드 → 분석 결과 반환" />
          <Endpoint method="GET" path="/v1/analyses/{id}" desc="저장된 분석 결과 조회" />
          <Endpoint method="GET" path="/v1/analyses?patient_id={id}" desc="환자별 이력 조회" />
          <Endpoint method="POST" path="/v1/labels" desc="의사 음성 라벨 저장 (STT + LLM 정형화)" />
          <Endpoint method="DELETE" path="/v1/analyses/{id}" desc="분석 결과 삭제" />
        </div>
      </Card>

      <Card className="p-6 mt-5 bg-[var(--brand-light)] border-[var(--brand)]/15">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[var(--brand)] mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--brand-dark)]">보안</h3>
            <ul className="text-[12px] text-[var(--brand-dark)]/85 mt-2 space-y-1 list-disc list-inside leading-relaxed">
              <li>Bearer Token 인증 (만료 24h, 갱신 API 제공)</li>
              <li>업로드 영상은 24시간 후 자동 삭제 (개인정보 보호)</li>
              <li>HTTPS 통신, 모든 요청 로그 기록</li>
              <li>환자 ID는 클라이언트가 제공하는 익명 식별자만 저장</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-[var(--brand)]" strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-fg)]">{label}</span>
      </div>
      <div className="text-[13px] font-medium font-mono">{value}</div>
    </Card>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, "success" | "info" | "warning" | "danger"> = {
    GET: "info", POST: "success", PUT: "warning", DELETE: "danger",
  };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <Badge variant={colors[method] ?? "neutral"} className="!w-16 !justify-center font-mono">{method}</Badge>
      <span className="font-mono text-[13px] text-[var(--foreground)] flex-1 min-w-0 truncate">{path}</span>
      <span className="text-[12px] text-[var(--muted-fg)] hidden md:block">{desc}</span>
    </div>
  );
}
