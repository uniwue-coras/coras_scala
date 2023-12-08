export function partitionArray<T>(arr: T[], f: (t: T) => boolean): [T[], T[]] {
  return arr.reduce<[T[], T[]]>(
    ([pos, neg], current) => f(current) ? [[...pos, current], neg] : [pos, [...neg, current]],
    [[], []]
  );
}
