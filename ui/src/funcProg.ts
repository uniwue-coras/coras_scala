export function takeWhile<T>(ts: T[], f: (t: T) => boolean): [T[], T[]] {
  const firstNotTakenIndex: number = ts.findIndex((t) => !f(t));

  return firstNotTakenIndex !== -1
    ? [ts.slice(0, firstNotTakenIndex), ts.slice(firstNotTakenIndex)]
    : [ts, []];
}

export function dropWhile<T>(ts: T[], f: (t: T) => boolean): T[] {
  const firstNotDroppedIndex = ts.findIndex((t) => !f(t));

  return firstNotDroppedIndex !== -1
    ? ts.slice(firstNotDroppedIndex)
    : [];
}

