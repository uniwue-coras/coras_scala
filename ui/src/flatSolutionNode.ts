import {FlatSolutionNode} from './graphql';

export function partitionArray<T>(values: T[], test: (t: T) => boolean): [T[], T[]] {
  return values.reduce<[T[], T[]]>(([pros, cons], current) => test(current)
      ? [[...pros, current], cons]
      : [pros, [...cons, current]],
    [[], []]);
}

export function findChildren(currentParentId: undefined | number, nodes: FlatSolutionNode[]): FlatSolutionNode[] {
  return nodes.filter(({parentId}) => parentId === currentParentId);
}
