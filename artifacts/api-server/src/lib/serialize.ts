/** Convert Date fields to ISO strings so Zod string schemas accept them */
export function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result as T;
}

export function serializeDatesArray<T extends Record<string, unknown>>(arr: T[]): T[] {
  return arr.map(serializeDates);
}
