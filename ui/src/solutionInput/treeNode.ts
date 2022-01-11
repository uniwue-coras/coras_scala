export interface TreeNode<T extends TreeNode<T>> {
  children: T[];
}

interface FlatTreeNode {
  id: number;
  parentId?: number | null | undefined;
}

// find children

export function findChildren<T extends FlatTreeNode>(currentParentId: number | undefined, allNodes: T[]): T[] {
  return allNodes
    .filter(({parentId}) => (currentParentId || currentParentId === 0)
      ? parentId === currentParentId
      : !parentId && parentId !== 0);
}

// Tree -> FlatTree

function flattenEntry<T extends TreeNode<T>, U extends FlatTreeNode>(
  {children, ...rest}: T,
  currentIndex: number,
  parentId: number | undefined,
  f: (entry: Omit<T, 'children'>, id: number, parentId: number | undefined) => U
): [U[], number] {
  const id = currentIndex++;

  const entry = f(rest, id, parentId);

  const [convertedChildren, indexAfter] = flattenEntries(children, f, currentIndex, id);

  return [[entry, ...convertedChildren], indexAfter];
}

export function flattenEntries<T extends TreeNode<T>, U extends FlatTreeNode>(
  entries: T[],
  f: (entry: Omit<T, 'children'>, id: number, parentId: number | undefined) => U,
  currentIndex = 0,
  parentId: number | undefined = undefined,
): [U[], number] {
  return entries.reduce<[U[], number]>(
    ([acc, indexPrior], c) => {
      const [newEntries, indexAfter] = flattenEntry(c, indexPrior, parentId, f);

      return [[...acc, ...newEntries], indexAfter];
    },
    [[], currentIndex]
  );
}

// FlatTree -> Tree

export function inflateEntries<T extends FlatTreeNode, U extends TreeNode<U>>(
  entries: T[],
  f: (id: number, index: number, entry: Omit<T, 'id' | 'parentId'>, children: U[]) => U,
  currentParentId: number | undefined = undefined
): U[] {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  return findChildren(currentParentId, entries)
    .map(({id, parentId, ...rest}, index) => f(id, index, rest, inflateEntries(entries, f, id)));
}
