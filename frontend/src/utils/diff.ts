// src/utils/diff.ts
export function diffPartial<T extends Record<string, any>>(
  original: T,
  current: Partial<T>,
  allowKeys?: (keyof T)[]
): Partial<T> {
  const patch: Partial<T> = {}
  const keys = (allowKeys ?? (Object.keys(current) as (keyof T)[]))

  for (const key of keys) {
    const curr = current[key]
    const orig = original[key]

    // porównanie płytkie; dla string/number/boolean/null/undefined OK
    if (curr !== undefined && curr !== orig) {
      patch[key] = curr
    }
  }
  return patch
}
