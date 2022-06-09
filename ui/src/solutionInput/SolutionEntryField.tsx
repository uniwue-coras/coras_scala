import {useState} from 'react';
import {SolutionEntryFieldArray} from './SolutionEntryFieldArray';
import {DeleteValues, MoveValues, ReduceValues, TreeNodeFieldProps} from './SolutionEntryMainField';
import {RawSolutionEntry} from './solutionEntryNode';

interface IProps {
  entry: RawSolutionEntry;
  name: string;
  index: number;
  depth: number;
  moveValues?: MoveValues;
  addChild?: () => void;
  deleteEntry?: () => void;
  children: (t: TreeNodeFieldProps) => JSX.Element;
}

export function SolutionEntryField({entry, name, index, depth, moveValues, addChild, deleteEntry, children}: IProps): JSX.Element {

  const isNotEmpty = entry.children.length > 0;

  const [isReduced, setIsReduced] = useState(false);

  const reduceValues: ReduceValues = {
    isReducible: isNotEmpty,
    isReduced,
    toggleIsReduced: () => setIsReduced((value) => !value)
  };

  const deleteValues: DeleteValues | undefined = deleteEntry
    ? {deleteEntry, deletionDisabled: isNotEmpty}
    : undefined;

  return (
    <>
      {children({entry, name, index, depth, reduceValues, moveValues, addChild, deleteValues})}

      {!isReduced && <div className="mt-2 ml-10">
        <SolutionEntryFieldArray namePath={name} entries={entry.children} depth={depth + 1} canMoveChildren={!!moveValues} canDeleteChildren={!!deleteEntry}>
          {children}
        </SolutionEntryFieldArray>
      </div>}

    </>
  );
}
