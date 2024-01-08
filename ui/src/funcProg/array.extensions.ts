declare global {
  interface Array<T> {
    dropWhile: (f: (t: T) => boolean) => T[];
  }
}

if (!Array.prototype.dropWhile) {
  Array.prototype.dropWhile = function <T>(this: T[], f: (t: T) => boolean): T[] {
    const firstNotDroppedIndex = this.findIndex((t) => !f(t));

    return firstNotDroppedIndex !== -1
      ? this.slice(firstNotDroppedIndex)
      : [];
  };
}

export { };
