export abstract class MyResult<T, E> {

  abstract map<U>(f: (t: T) => U): MyResult<U, E>;

  abstract flatMap<U>(f: (t: T) => MyResult<U, E>): MyResult<U, E>;

  abstract handle(onOk: (t: T) => void, onError: (e: E) => void): void;

}

export class Ok<T> extends MyResult<T, never> {
  constructor(private value: T) {
    super();
  }

  override map<U>(f: (t: T) => U): MyResult<U, never> {
    return new Ok(f(this.value));
  }

  override flatMap<U>(f: (t: T) => MyResult<U, never>): MyResult<U, never> {
    return f(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override handle(onOk: (t: T) => void, _ /* onError*/: (e: never) => void) {
    onOk(this.value);
  }
}

export class MyError<E> extends MyResult<never, E> {
  constructor(private value: E) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  flatMap<U>(_ /*f*/: (t: never) => MyResult<U, E>): MyResult<U, E> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<U>(_ /*f*/: (t: never) => U): MyResult<U, E> {
    return this;
  }

  override handle(_ /*onOk*/: (t: never) => void, onError: (e: E) => void) {
    onError(this.value);
  }

}
