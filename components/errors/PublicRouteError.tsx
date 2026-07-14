"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { publicErrorReference } from "@/lib/public-error-reference";

type BoundaryError = Error & {
  digest?: string;
  requestId?: unknown;
};

export interface PublicRouteErrorProps {
  error: BoundaryError;
  unstable_retry: () => void;
}

export default function PublicRouteError({
  error,
  unstable_retry,
}: PublicRouteErrorProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const reference = publicErrorReference({
    digest: error.digest,
    requestId: error.requestId,
  });

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div className="page-dark flex min-h-[100svh] items-center">
      <main
        className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-24"
        aria-labelledby="error-title"
        role="alert"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ob-brass)]">
          A temporary detour
        </p>
        <h1
          ref={heading}
          id="error-title"
          tabIndex={-1}
          className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight outline-none sm:text-6xl"
        >
          We could not finish loading this page.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--ob-sand-dim)] sm:text-lg">
          Try the page again. If the problem continues, return home and choose
          another place or route.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            className="button-primary min-h-11 px-5"
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
          <Link href="/" className="button-secondary min-h-11 px-5">
            Go home
          </Link>
        </div>
        {(reference.requestId || reference.digest) && (
          <p className="mt-8 break-all text-xs leading-5 text-[var(--ob-stone)]">
            Support reference: {reference.requestId ?? reference.digest}
          </p>
        )}
      </main>
    </div>
  );
}
