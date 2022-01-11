import {FieldArray} from 'formik';
import {SolutionEntryField} from './SolutionEntryField';
import {MoveValues, TreeNodeFieldProps} from './SolutionEntryMainField';
import {SolutionEntryNode} from './solutionEntryNode';

interface IProps<T extends SolutionEntryNode<T>> {
  namePath?: string;
  depth?: number;
  entries: T[];
  canMoveChildren?: boolean;
  canDeleteChildren?: boolean;
  children: (t: TreeNodeFieldProps<T>) => JSX.Element;
}

export function SolutionEntryFieldArray<T extends SolutionEntryNode<T>>({
  namePath,
  depth = 0,
  entries,
  canMoveChildren,
  canDeleteChildren,
  children
}: IProps<T>): JSX.Element {

  const name = namePath ? `${namePath}.children` : 'children';

  return (
    <FieldArray name={name}>
      {(arrayHelpers) => <>
        {entries.map((entry, index) => {
            const isLast = index === entries.length - 1;

            const moveValues: MoveValues | undefined = canMoveChildren
              ? {
                moveUp: () => index > 0 && arrayHelpers.swap(index, index - 1),
                moveDown: () => !isLast && arrayHelpers.swap(index, index + 1),
                isFirst: index === 0, isLast
              }
              : undefined;

            const deleteEntry = canDeleteChildren
              ? () => arrayHelpers.remove(index)
              : undefined;

            return (
              <SolutionEntryField key={index} entry={entry} name={`${name}.${index}`} index={index} depth={depth} moveValues={moveValues}
                                  deleteEntry={deleteEntry}>{children}</SolutionEntryField>
            );
          }
        )}
      </>}
    </FieldArray>
  );
}

