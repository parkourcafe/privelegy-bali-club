export class PersonalWriteBarrier {
  #blocked = false;
  #generation = 0;
  readonly #inFlight = new Set<Promise<void>>();

  get blocked(): boolean {
    return this.#blocked;
  }

  run<T>(operation: (generation: number) => Promise<T>): Promise<T> | null {
    if (this.#blocked) return null;
    const generation = this.#generation;
    const result = Promise.resolve().then(() => operation(generation));
    const tracked = result.then(() => undefined, () => undefined);
    this.#inFlight.add(tracked);
    void tracked.finally(() => this.#inFlight.delete(tracked));
    return result;
  }

  block(): number {
    this.#blocked = true;
    this.#generation += 1;
    return this.#generation;
  }

  async waitForSettled(): Promise<void> {
    while (this.#inFlight.size > 0) {
      await Promise.all([...this.#inFlight]);
    }
  }

  release(generation: number): void {
    if (generation !== this.#generation) return;
    this.#blocked = false;
  }

  isCurrent(generation: number): boolean {
    return !this.#blocked && generation === this.#generation;
  }
}
