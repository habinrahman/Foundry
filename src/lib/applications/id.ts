let sequence = 0;

export function createApplicationId(now = new Date()): string {
  sequence += 1;
  const year = now.getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `APP-${year}-${padded}`;
}

/** Test helper — do not use in production routes. */
export function resetApplicationIdSequence(): void {
  sequence = 0;
}
