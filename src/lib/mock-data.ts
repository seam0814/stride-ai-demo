export type DemoStage = "idle" | "analyzing" | "complete";

export type Keypoint = { x: number; y: number; conf: number };

// Pose keypoints for sample frames (relative coordinates 0-1).
// Side-view runner skeleton — head, shoulders, hips, knees, ankles, toes.
export const samplePose: Record<string, Keypoint> = {
  head:        { x: 0.50, y: 0.18, conf: 0.96 },
  neck:        { x: 0.50, y: 0.26, conf: 0.95 },
  shoulderL:   { x: 0.46, y: 0.30, conf: 0.94 },
  shoulderR:   { x: 0.54, y: 0.30, conf: 0.94 },
  elbowL:      { x: 0.39, y: 0.42, conf: 0.91 },
  elbowR:      { x: 0.61, y: 0.42, conf: 0.92 },
  wristL:      { x: 0.34, y: 0.52, conf: 0.88 },
  wristR:      { x: 0.66, y: 0.52, conf: 0.89 },
  hipL:        { x: 0.47, y: 0.52, conf: 0.96 },
  hipR:        { x: 0.53, y: 0.52, conf: 0.96 },
  kneeL:       { x: 0.43, y: 0.70, conf: 0.93 },
  kneeR:       { x: 0.58, y: 0.66, conf: 0.92 },
  ankleL:      { x: 0.40, y: 0.86, conf: 0.90 },
  ankleR:      { x: 0.62, y: 0.84, conf: 0.91 },
  toeL:        { x: 0.36, y: 0.92, conf: 0.85 },
  toeR:        { x: 0.66, y: 0.92, conf: 0.86 },
};

export const POSE_EDGES: Array<[keyof typeof samplePose, keyof typeof samplePose]> = [
  ["head", "neck"],
  ["neck", "shoulderL"], ["neck", "shoulderR"],
  ["shoulderL", "elbowL"], ["elbowL", "wristL"],
  ["shoulderR", "elbowR"], ["elbowR", "wristR"],
  ["neck", "hipL"], ["neck", "hipR"],
  ["hipL", "hipR"],
  ["hipL", "kneeL"], ["kneeL", "ankleL"], ["ankleL", "toeL"],
  ["hipR", "kneeR"], ["kneeR", "ankleR"], ["ankleR", "toeR"],
];

export type Metric = {
  key: string;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
  reference: string;
  desc: string;
};

export const sampleMetrics: Metric[] = [
  { key: "cadence", label: "케이던스", value: "168", unit: "spm", status: "warning", reference: "정상 175~185", desc: "분당 걸음 수가 다소 낮습니다. 짧고 빠른 보폭이 권장됩니다." },
  { key: "stride", label: "보폭", value: "1.42", unit: "m", status: "warning", reference: "정상 1.10~1.30", desc: "보폭이 길어 무릎 충격이 증가할 수 있습니다." },
  { key: "ground", label: "지면 접촉 시간", value: "248", unit: "ms", status: "warning", reference: "정상 180~220", desc: "접촉 시간이 길어 추진력 저하가 우려됩니다." },
  { key: "knee", label: "무릎 굽힘 각도", value: "138°", unit: "", status: "normal", reference: "정상 130°~145°", desc: "착지 시 무릎 굽힘은 적정 범위입니다." },
  { key: "trunk", label: "체간 전방 기울기", value: "12°", unit: "", status: "normal", reference: "정상 8°~14°", desc: "상체 자세 적정." },
  { key: "verticalOsc", label: "수직 진폭", value: "9.4", unit: "cm", status: "danger", reference: "정상 6~8", desc: "수직 진폭이 커 에너지 손실이 큽니다." },
];

export type RiskZone = {
  name: string;
  region: "knee" | "ankle" | "hip" | "back" | "foot";
  risk: number; // 0-100
  reason: string;
};

export const riskZones: RiskZone[] = [
  { name: "우측 슬개대퇴 통증 증후군", region: "knee", risk: 72, reason: "큰 보폭 + 수직 진폭 과다 → 슬개골 충격 증가" },
  { name: "좌측 아킬레스건 부하", region: "ankle", risk: 48, reason: "지면 접촉 시간이 길어 발목 부하 누적" },
  { name: "장경인대 마찰 증후군", region: "hip", risk: 35, reason: "골반 좌우 비대칭 약 4도 관찰" },
];

export const overallRisk = 65;

export type Prescription = {
  category: "drill" | "stretch" | "strength" | "tip";
  title: string;
  desc: string;
};

export const prescriptions: Prescription[] = [
  { category: "drill", title: "케이던스 +10 연습", desc: "메트로놈 180bpm에 맞춰 5분 × 3세트. 보폭은 그대로, 빈도만 늘려보세요." },
  { category: "drill", title: "버트킥 (Butt Kick)", desc: "발뒤꿈치를 엉덩이까지 올리는 연습으로 햄스트링 활성화 + 수직 진폭 감소." },
  { category: "stretch", title: "장경인대 폼롤러", desc: "측면 허벅지 1분씩 좌우. 운동 전후 시행." },
  { category: "strength", title: "글루트 브릿지 3×15", desc: "엉덩이 활성화로 무릎 부하 분산. 주 3회." },
  { category: "tip", title: "낮은 드롭 신발 선택", desc: "히일-투-토 드롭 4mm 이하 신발이 자연스러운 미드풋 착지를 유도합니다." },
];

export type Analysis = {
  id: string;
  date: string;
  videoLabel: string;
  views: ("front" | "side" | "back")[];
  duration: string;
  overallRisk: number;
  topZone: string;
  thumb: string;
};

export const pastAnalyses: Analysis[] = [
  { id: "a001", date: "2026-05-08", videoLabel: "5km 트랙 측면 (10:24)", views: ["side"], duration: "0:42", overallRisk: 65, topZone: "우측 슬개대퇴", thumb: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80" },
  { id: "a002", date: "2026-05-05", videoLabel: "공원 후면 촬영", views: ["back"], duration: "0:28", overallRisk: 58, topZone: "좌측 아킬레스", thumb: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80" },
  { id: "a003", date: "2026-04-28", videoLabel: "트레드밀 정면", views: ["front"], duration: "0:35", overallRisk: 41, topZone: "골반 비대칭", thumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80" },
  { id: "a004", date: "2026-04-15", videoLabel: "하천변 종합 (3각도)", views: ["front", "side", "back"], duration: "1:08", overallRisk: 72, topZone: "우측 슬개대퇴", thumb: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&q=80" },
];

// Voice labeling sample
export type LabelSample = {
  raw: string; // STT raw output
  corrected: string; // LLM-corrected
  structured: {
    risk: number;
    region: string;
    diagnosis: string;
    prescription: string;
  };
};

export const sampleLabels: LabelSample[] = [
  {
    raw: "이 환자분 우측 슬개골 패턴이 좋지 안고요 케이던스가 낮아서 무릎에 충견이 가고있습니다 보폭을 좀 줄이고 캐던스를 올리는 드릴을 처방하겠습니다",
    corrected: "이 환자분 우측 슬개골 패턴이 좋지 않고요. 케이던스가 낮아서 무릎에 충격이 가고 있습니다. 보폭을 좀 줄이고 케이던스를 올리는 드릴을 처방하겠습니다.",
    structured: {
      risk: 72,
      region: "우측 슬개대퇴",
      diagnosis: "케이던스 저하로 인한 무릎 과부하",
      prescription: "케이던스 +10 드릴 / 보폭 단축 연습",
    },
  },
];

export const SAMPLE_VIDEOS = [
  { id: "v1", label: "측면 (Side)", desc: "5km 트랙 측면 촬영", img: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&q=80" },
  { id: "v2", label: "정면 (Front)", desc: "트레드밀 정면 촬영", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80" },
  { id: "v3", label: "후면 (Back)", desc: "공원 후면 촬영", img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&q=80" },
];
