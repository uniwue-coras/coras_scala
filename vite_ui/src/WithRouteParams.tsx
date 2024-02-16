import { ReactElement } from "react";
import { Params, useParams } from "react-router-dom";

export type ParamReturnType<T extends string | Record<string, string | undefined>> = Readonly<[T] extends [string] ? Params<T> : Partial<T>>;

interface IProps<T extends string | Record<string, string | undefined>, P> {
  readParams: (t: ParamReturnType<T>) => P;
  children: (params: P) => ReactElement;
}

export function WithRouterParams<T extends string | Record<string, string | undefined>, P>({ readParams, children }: IProps<T, P>): ReactElement {

  const urlParams: Readonly<[T] extends [string] ? Params<T> : Partial<T>> = useParams<T>();

  const params = readParams(urlParams);

  return <>{children(params)}</>;
}
