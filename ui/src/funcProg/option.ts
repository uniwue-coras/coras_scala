import {MyError, MyResult, Ok} from './results';

export abstract class MyOption<T> {

// noinspection JSUnusedGlobalSymbols
  abstract map<U>(f: (t: T) => U): MyOption<U>;

// noinspection JSUnusedGlobalSymbols
  abstract flatMap<U>(f: (t: T) => MyOption<U>): MyOption<U>;

// noinspection JSUnusedGlobalSymbols
  abstract getOrElse(value: T): T;

// noinspection JSUnusedGlobalSymbols
  abstract forEach(f: (t: T) => void): void;

  abstract handle(
    onSome: (t: T) => void,
    onNone: () => void,
  ): void;

  abstract filter(f: (t: T) => boolean): MyOption<T>;

  abstract toResult<E>(onError: () => E): MyResult<T, E>;

  static of<T>(value: T | undefined | null): MyOption<T> {
    return value !== undefined && value !== null
      ? new Some(value)
      : None;
  }

  static empty<T>(): MyOption<T> {
    return None;
  }

}

export class Some<T> extends MyOption<T> {
  constructor(private value: T) {
    super();
  }

  getValue(): T {
    return this.value;
  }

  override map<U>(f: (t: T) => U): MyOption<U> {
    return new Some(f(this.value));
  }

  override flatMap<U>(f: (t: T) => MyOption<U>): MyOption<U> {
    return f(this.value);
  }

  override forEach(f: (t: T) => void): void {
    f(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override handle(onSome: (t: T) => void, onNone: () => void): void {
    onSome(this.value);
  }

  override filter(f: (t: T) => boolean): MyOption<T> {
    return f(this.value) ? this : None;
  }

  override toResult<E>(): MyResult<T, E> {
    return new Ok(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getOrElse(value: T): T {
    return this.value;
  }

}

class NoneClass extends MyOption<never> {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override map<T, U>(f: (t: T) => U): MyOption<U> {
    return None;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override flatMap<T, U>(f: (t: T) => MyOption<U>): MyOption<U> {
    return None;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  override forEach(f: (t: never) => void): void {
  }

  override handle(onSome: (t: never) => void, onNone: () => void): void {
    onNone();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override filter(f: (t: never) => boolean): MyOption<never> {
    return None;
  }

  override toResult<E>(onError: () => E): MyResult<never, E> {
    return new MyError(onError());
  }

  override getOrElse<T>(value: T): T {
    return value;
  }
}

const None = new NoneClass();
