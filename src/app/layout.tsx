import type { Metadata } from "next";
import "./globals.css";
import { StateProvider } from "@/components/state-provider";
import { DemoBar } from "@/components/demo-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Stride — AI 달리기 자세 분석",
  description:
    "스마트폰 영상으로 분석하는 달리기 자세 + 부상 위험도 + 교정 처방. MediaPipe + Whisper 기반 MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <StateProvider>
          <DemoBar />
          <SiteHeader />
          <main className="flex-1 animate-fade-in">{children}</main>
          <SiteFooter />
        </StateProvider>
      </body>
    </html>
  );
}
