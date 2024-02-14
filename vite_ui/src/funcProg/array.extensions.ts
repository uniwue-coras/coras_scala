export function partitionArray<T>(array: Array<T>, f: (t: T) => boolean): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pos, neg], current) => f(current) ? [[...pos, current], neg] : [pos, [...neg, current]],
    [[], []]
  );
}

export function dropWhile<T>(array: T[], f: (t: T) => boolean): T[] {
  const firstNotDroppedIndex = array.findIndex((t) => !f(t));

  return firstNotDroppedIndex !== -1
    ? array.slice(firstNotDroppedIndex)
    : [];
}
