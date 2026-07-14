export const PUBLIC_DATA_UNAVAILABLE = "public_data_unavailable" as const;

export class PublicDataUnavailableError extends Error {
  readonly code = PUBLIC_DATA_UNAVAILABLE;
  readonly context: string;

  constructor(context: string) {
    super(PUBLIC_DATA_UNAVAILABLE);
    this.name = "PublicDataUnavailableError";
    this.context = context;
  }
}

export function requireConfiguredPublicDataSource(
  configured: boolean,
  context: string,
  deploymentEnvironment = process.env.VERCEL_ENV,
): void {
  if (deploymentEnvironment && !configured) {
    throw new PublicDataUnavailableError(context);
  }
}

export function failPublicDataRead(context: string): never {
  throw new PublicDataUnavailableError(context);
}

export function isPublicDataUnavailable(error: unknown): error is PublicDataUnavailableError {
  return error instanceof PublicDataUnavailableError
    || (error instanceof Error && error.message === PUBLIC_DATA_UNAVAILABLE);
}
