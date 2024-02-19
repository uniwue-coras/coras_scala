import { ReactElement } from "react";
import { Navigate, Params, useParams } from "react-router-dom";
import { homeUrl } from "./urls";

type ParamsT = string | Record<string, string | undefined>;

export type ParamReturnType<T extends ParamsT> = Readonly<[T] extends [string] ? Params<T> : Partial<T>>;

interface IProps<T extends ParamsT, P> {
  readParams: (t: ParamReturnType<T>) => P | undefined;
  children: (params: P) => ReactElement;
  onUndefined?: () => ReactElement;
}

export function WithRouterParams<T extends ParamsT, P>({ readParams, children, onUndefined = () => <Navigate to={homeUrl} /> }: IProps<T, P>): ReactElement {

  const urlParams: Readonly<[T] extends [string] ? Params<T> : Partial<T>> = useParams<T>();

  const params = readParams(urlParams);

  return <>{params !== undefined ? children(params) : onUndefined()}</>;
}
