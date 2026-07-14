"use client";

import { useState } from "react";
import {
  buildReportIncorrectMailto,
  REPORT_INCORRECT_REASONS,
  type ReportIncorrectReason,
} from "@/lib/report-incorrect";

export default function ReportIncorrectForm({
  venueSlug,
  venueName,
}: {
  venueSlug: string;
  venueName: string;
}) {
  const [reason, setReason] = useState<ReportIncorrectReason>("place_closed");
  const [prepared, setPrepared] = useState(false);
  const [failed, setFailed] = useState(false);

  function prepareReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = buildReportIncorrectMailto({ venueSlug, venueName, reason });
    if (!href) {
      setFailed(true);
      setPrepared(false);
      return;
    }
    setFailed(false);
    setPrepared(true);
    window.location.assign(href);
  }

  return (
    <section className="guide-section" aria-labelledby="report-incorrect-heading">
      <h2 id="report-incorrect-heading">Report incorrect information</h2>
      <p className="guide-lede">
        Choose what changed. We will prepare an email for editorial review;
        nothing is updated or published automatically.
      </p>
      <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={prepareReport}>
        <label className="min-w-[14rem] flex-1">
          <span className="field-label">What is wrong?</span>
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-2 text-sm text-[var(--ink)]"
            value={reason}
            onChange={(event) => setReason(event.target.value as ReportIncorrectReason)}
          >
            {REPORT_INCORRECT_REASONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="button-secondary">
          Prepare email report
        </button>
      </form>
      <div className="mt-3 text-sm text-[var(--muted)]" aria-live="polite">
        {prepared ? (
          <p>Your mail app should open. Send the prepared message to complete the report.</p>
        ) : null}
        {failed ? (
          <p role="alert">
            We could not prepare the report. Email{" "}
            <a className="underline" href="mailto:support@otherbali.com">support@otherbali.com</a>.
          </p>
        ) : null}
      </div>
    </section>
  );
}
