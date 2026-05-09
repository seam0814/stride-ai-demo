export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 py-8 text-[11px] text-[var(--muted-fg)] flex flex-col sm:flex-row gap-2 justify-between">
        <span>© 2026 Stride — AI 달리기 자세 분석 (위시켓 입찰용 데모)</span>
        <span>본 결과물은 참고용이며 의학적 진단·처방을 대체하지 않습니다.</span>
      </div>
    </footer>
  );
}
