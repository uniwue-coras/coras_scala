export function dropWhile<T>(ts: T[], f: (t: T) => boolean): T[] {
  const firstNotDroppedIndex = ts.findIndex((t) => !f(t));

  return firstNotDroppedIndex !== -1
    ? ts.slice(firstNotDroppedIndex)
    : [];
}

