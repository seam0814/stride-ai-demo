"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { DemoStage } from "@/lib/mock-data";

type Ctx = {
  stage: DemoStage;
  setStage: (s: DemoStage) => void;
};

const StateContext = createContext<Ctx | null>(null);

export function StateProvider({ children }: { children: ReactNode }) {
  const [stage, setStageVal] = useState<DemoStage>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("stride-stage") as DemoStage | null;
    if (s) setStageVal(s);
    setHydrated(true);
  }, []);

  const setStage = (s: DemoStage) => {
    setStageVal(s);
    localStorage.setItem("stride-stage", s);
  };

  return (
    <StateContext.Provider value={{ stage, setStage }}>
      <div style={{ visibility: hydrated ? "visible" : "hidden" }}>{children}</div>
    </StateContext.Provider>
  );
}

export function useStride() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useStride must be inside StateProvider");
  return ctx;
}
