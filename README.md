# Stride — AI 달리기 자세 분석 (위시켓 입찰용 데모)

위시켓 "달리기 자세 분석 및 부상 위험도 예측 AI 모델 개발 (오픈소스 기반)" 공고 입찰용 데모. 1,500만/60일 기준.

**Tech (데모)**: Next.js 16 · React 19 · TypeScript · Tailwind v4 · Pretendard · SVG-based pose visualization

> 본 데모는 UI/UX 시연용입니다. **실제 납품은 브리프대로 Python + FastAPI + MediaPipe + Whisper + GPT-4o-mini + Streamlit 라벨링 툴**로 진행됩니다.

## 5개 페이지 — 공고 요구 기능 매핑

| 공고 항목 | 구현 페이지 |
|---|---|
| 2-1 음성 라벨링 툴 (Whisper + LLM 정형화) | `/label` (Web Speech API 작동, 샘플 시연 포함) |
| 2-2 오픈소스 자세 분석 (MediaPipe) | `/analyze` (SVG 키포인트 + 분석 진행 애니메이션) |
| 2-3 부상 위험도 + 처방 추론 | `/analyze` (위험도 게이지, 부위별 위험도, 처방 카드) |
| 2-4 REST API 서빙 | `/api-docs` (curl 예시, JSON 스키마, 엔드포인트 표) |
| 분석 이력 (대시보드) | `/results` (영상별 위험도 추적) |

## 데모 시점 토글

상단 검은 바의 3가지 시점:

- **영상 미업로드** — 업로드 화면
- **분석 중** — 키포인트 스캔 라인 애니메이션 + 진행률
- **분석 완료** — 위험도 게이지 + 지표 + 처방 풀 노출

`/analyze`에서 즉시 반영됩니다. 평가자가 클릭 한 번으로 전·중·후 흐름 체험.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000

## 배포

GitHub 연결 후 Vercel에서 환경변수 없이 그대로 Deploy.

## 폴더 구조

```
src/
  app/
    page.tsx              # 랜딩 (히어로 + 4 pillar)
    analyze/              # 영상 분석 (메인)
    label/                # 의사 음성 라벨링 툴
    results/              # 분석 이력
    api-docs/             # API 명세
  components/
    pose-overlay.tsx      # SVG 키포인트 시각화 (16 keypoint)
    state-provider.tsx    # 데모 시점 (idle/analyzing/complete)
    demo-bar.tsx, site-header, site-footer
    ui/                   # button, card, badge
  lib/
    mock-data.ts          # 샘플 영상, 지표, 위험 부위, 처방, 라벨, 이력
    utils.ts
```
