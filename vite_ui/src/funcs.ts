export function isDefined<T>(t: T | undefined | null): t is T {
  return t !== undefined && t !== null;
}

export function withDefined<T, U>(t: T | undefined | null, f: (t: T) => U, g: () => U): U {
  return isDefined(t) ? f(t) : g();
}

export function assertDefined<T, U>(t: T | undefined | null, onNotDefined: () => U, onDefined: (t: T) => U): U {
  return isDefined(t) ? onDefined(t) : onNotDefined();
}
