// The "Other Bali" wordmark — single source of truth for the logo text.
//
// translate="no" + lang="en" tell browser auto-translate (Chrome/Safari
// "Translate this page") to leave the brand name alone. "Other Bali" is a proper
// noun and must read identically in every language (guardrail #15: public UI is
// English). Without this, a Russian reader hitting Translate sees the logo turn
// into "Другой Бали".
export default function Brand({ className }: { className?: string }) {
  return (
    <span translate="no" lang="en" className={className}>
      Other Bali
    </span>
  );
}
