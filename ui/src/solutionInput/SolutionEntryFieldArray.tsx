import {FieldArray} from 'formik';
import {SolutionEntryField} from './SolutionEntryField';
import {MoveValues, TreeNodeFieldProps} from './solutionEntryMainField';
import {RawSolutionNode} from './solutionEntryNode';

interface IProps {
  namePath?: string;
  depth?: number;
  entries: RawSolutionNode[];
  canMoveChildren?: boolean;
  canDeleteChildren?: boolean;
  children: (t: TreeNodeFieldProps) => JSX.Element;
}

export function SolutionEntryFieldArray({namePath, depth = 0, entries, canMoveChildren, canDeleteChildren, children}: IProps): JSX.Element {

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

