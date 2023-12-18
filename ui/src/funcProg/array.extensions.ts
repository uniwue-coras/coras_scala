declare global {
  interface Array<T> {
    partition: (f: (t: T) => boolean) => [T[], T[]];
    dropWhile: (f: (t: T) => boolean) => T[];
  }
}

if (!Array.prototype.partition) {
  Array.prototype.partition = function <T>(this: Array<T>, f: (t: T) => boolean): [T[], T[]] {
    return this.reduce<[T[], T[]]>(
      ([pos, neg], current) => f(current) ? [[...pos, current], neg] : [pos, [...neg, current]],
      [[], []]
    );
  };

  Array.prototype.dropWhile = function <T>(this: T[], f: (t: T) => boolean): T[] {
    const firstNotDroppedIndex = this.findIndex((t) => !f(t));

    return firstNotDroppedIndex !== -1
      ? this.slice(firstNotDroppedIndex)
      : [];
  };
}

export { };
