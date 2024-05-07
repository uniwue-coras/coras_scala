import { ReactElement, useState } from 'react';
import { AbbreviationFragment, useDeleteAbbreviationMutation, useSubmitAbbreviationMutation, useUpdateAbbreviationMutation } from '../graphql';
import { DeleteIcon, UpdateIcon } from '../icons';
import { executeMutation } from '../mutationHelpers';
import update from 'immutability-helper';

interface IProps {
  initialAbbreviation: AbbreviationFragment | undefined;
  onChanged: (abbreviation: AbbreviationFragment) => void;
  onDeleted: () => void;
}

interface IState extends AbbreviationFragment {
  originalAbbreviation: AbbreviationFragment | undefined;
}

const prepareState = (originalAbbreviation: AbbreviationFragment | undefined): IState => originalAbbreviation !== undefined
  ? { ...originalAbbreviation, originalAbbreviation }
  : { abbreviation: '', word: '', originalAbbreviation };

export function EditAbbreviation({ initialAbbreviation, onChanged, onDeleted }: IProps): ReactElement {

  const [{ abbreviation, word, originalAbbreviation }, setState] = useState<IState>(prepareState(initialAbbreviation));

  const [submitAbbreviation, { loading: submitLoading }] = useSubmitAbbreviationMutation();
  const [editAbbreviation, { loading: editLoading }] = useUpdateAbbreviationMutation();
  const [deleteAbbreviation, { loading: deleteLoading }] = useDeleteAbbreviationMutation();

  const changed = originalAbbreviation === undefined || originalAbbreviation.abbreviation !== abbreviation || originalAbbreviation.word !== word;

  const onSubmit = () => originalAbbreviation !== undefined
    ? executeMutation(
      () => editAbbreviation({ variables: { abbreviation: originalAbbreviation?.abbreviation, abbreviationInput: { abbreviation, word } } }),
      ({ abbreviation }) => {
        const newAbbreviation = abbreviation?.edit;

        if (newAbbreviation) {
          setState((state) => update(state, { originalAbbreviation: { $set: newAbbreviation } }));
          onChanged(newAbbreviation);
        }
      }
    )
    : executeMutation(
      () => submitAbbreviation({ variables: { abbreviationInput: { abbreviation, word } } }),
      ({ newAbbreviation }) => onChanged(newAbbreviation)
    );

  const onDelete = () => originalAbbreviation !== undefined
    ? executeMutation(
      () => deleteAbbreviation({ variables: { abbreviation: originalAbbreviation.abbreviation } }),
      ({ abbreviation }) => abbreviation?.delete && onDeleted()
    )
    : onDeleted();

  return (
    <tr className="border-t border-slate-500">
      <td className="p-2">
        <input type="text" value={abbreviation} className="p-2 rounded border border-slate-500"
          onChange={(event) => setState((state) => update(state, { abbreviation: { $set: event.target.value } }))} />
      </td>
      <td className="p-2">
        <input type="text" value={word} className="p-2 rounded border border-slate-500 w-full"
          onChange={(event) => setState((state) => update(state, { word: { $set: event.target.value } }))} />
      </td>
      <td className="p-2 space-x-2">
        <button type="button" className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50" onClick={onSubmit} disabled={!changed || editLoading || submitLoading} >
          <UpdateIcon />
        </button>
        <button type="button" className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50" onClick={onDelete} disabled={deleteLoading}>
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
}
