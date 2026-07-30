import {
  classifySyncAcknowledgement,
  type SyncConflict,
  type SyncMutation,
} from "../../lib/journey/offline-sync";

export interface PendingSyncSettlement {
  pending: SyncMutation[];
  conflict: SyncConflict | null;
}

export interface PendingSyncFlushResult extends PendingSyncSettlement {
  appliedCount: number;
}

export function enqueuePendingSyncMutation(
  pending: SyncMutation[],
  next: SyncMutation,
  limit = 200,
): SyncMutation[] {
  const withoutSupersededTrip = next.entityType === "trip_stop"
    && next.operation === "trip_replace"
    ? pending.filter((candidate) => !(
      candidate.entityType === next.entityType
      && candidate.entityId === next.entityId
      && candidate.operation === next.operation
    ))
    : pending;

  return [...withoutSupersededTrip, next].slice(-Math.max(1, limit));
}

export function settlePendingSyncMutation(
  pending: SyncMutation[],
  mutation: SyncMutation,
  response: unknown,
): PendingSyncSettlement {
  const acknowledgement = classifySyncAcknowledgement(mutation, response);
  if (acknowledgement.outcome === "applied") {
    return {
      pending: pending.filter(
        (candidate) => candidate.idempotencyKey !== mutation.idempotencyKey,
      ),
      conflict: null,
    };
  }
  if (acknowledgement.outcome === "conflict") {
    return {
      pending,
      conflict: {
        mutation,
        code: "SYNC_VERSION_MISMATCH",
        serverVersion: acknowledgement.serverVersion,
      },
    };
  }
  return { pending, conflict: null };
}

export async function flushPendingSyncQueue(
  pending: SyncMutation[],
  push: (mutation: SyncMutation) => Promise<unknown>,
  persist: (pending: SyncMutation[]) => Promise<void>,
): Promise<PendingSyncFlushResult> {
  let remaining = [...pending];
  let appliedCount = 0;

  while (remaining.length > 0) {
    const mutation = remaining[0];
    const settlement = settlePendingSyncMutation(
      remaining,
      mutation,
      await push(mutation),
    );

    if (settlement.conflict) {
      return { ...settlement, appliedCount };
    }

    if (settlement.pending.length === remaining.length) {
      return { pending: remaining, conflict: null, appliedCount };
    }

    remaining = settlement.pending;
    appliedCount += 1;
    await persist(remaining);
  }

  return { pending: remaining, conflict: null, appliedCount };
}
