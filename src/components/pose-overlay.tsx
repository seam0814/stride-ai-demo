"use client";

import { POSE_EDGES, samplePose } from "@/lib/mock-data";

type Props = {
  className?: string;
  active?: boolean;
  variant?: "default" | "warning";
};

/**
 * Animated SVG skeleton overlay. Sized to fill its container (aspect-locked).
 * Uses absolute coordinates from samplePose (0-1) scaled to viewBox 100x100.
 */
export function PoseOverlay({ className = "", active = true, variant = "default" }: Props) {
  const lineColor = variant === "warning" ? "#f59e0b" : "#0ea5e9";
  const dotColor = variant === "warning" ? "#fbbf24" : "#38bdf8";
  const accentColor = "#f43f5e";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {POSE_EDGES.map(([a, b], i) => {
        const p1 = samplePose[a];
        const p2 = samplePose[b];
        const isHotEdge = a === "kneeR" || b === "kneeR";
        return (
          <line
            key={i}
            x1={p1.x * 100}
            y1={p1.y * 100}
            x2={p2.x * 100}
            y2={p2.y * 100}
            stroke={isHotEdge ? accentColor : lineColor}
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.3}
            filter="url(#glow)"
          />
        );
      })}

      {/* Keypoints */}
      {Object.entries(samplePose).map(([name, kp]) => {
        const isAccent = name === "kneeR";
        return (
          <g key={name}>
            {isAccent && active && (
              <circle
                cx={kp.x * 100}
                cy={kp.y * 100}
                r="2.5"
                fill={accentColor}
                opacity="0.4"
                className="animate-ping-soft"
              />
            )}
            <circle
              cx={kp.x * 100}
              cy={kp.y * 100}
              r={isAccent ? "1.4" : "1.0"}
              fill={isAccent ? accentColor : dotColor}
              stroke="white"
              strokeWidth="0.3"
              opacity={active ? 1 : 0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
