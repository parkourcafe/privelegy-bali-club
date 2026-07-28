"use client";

import { useState } from "react";

export default function TogetherShareButton() {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  async function share() {
    if (status === "working") return;
    setStatus("working");
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Other Bali Together", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("share_unavailable");
      }
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("error");
    }
  }

  return (
    <button type="button" className="together-share" onClick={share} disabled={status === "working"}>
      {status === "working" ? "Creating link…" : status === "done" ? "Link ready" : status === "error" ? "Try again" : "Share Together"}
    </button>
  );
}
