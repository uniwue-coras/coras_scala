import {JSX, useState} from 'react';
import {AbbreviationFragment, useDeleteAbbreviationMutation, useSubmitAbbreviationMutation, useUpdateAbbreviationMutation} from '../graphql';
import update from 'immutability-helper';
import {UpdateIcon} from '../icons';
import {executeMutation} from '../mutationHelpers';

interface IProps {
  initialAbbreviation: AbbreviationFragment | undefined;
  onChanged: (abbreviation: AbbreviationFragment) => void;
  onDeleted: () => void;
}

interface IState extends AbbreviationFragment {
  originalAbbreviation: AbbreviationFragment | undefined;
}

const prepareState = (originalAbbreviation: AbbreviationFragment | undefined): IState => originalAbbreviation !== undefined
  ? {...originalAbbreviation, originalAbbreviation}
  : {abbreviation: '', word: '', originalAbbreviation};

export function EditAbbreviation({initialAbbreviation, onChanged, onDeleted}: IProps): JSX.Element {

  const [{abbreviation, word, originalAbbreviation}, setState] = useState<IState>(prepareState(initialAbbreviation));

  const [submitAbbreviation, {loading: submitLoading/*, error*/}] = useSubmitAbbreviationMutation();
  const [editAbbreviation, {loading: editLoading/*, error*/}] = useUpdateAbbreviationMutation();
  const [deleteAbbreviation, {loading: deleteLoading/*, error*/}] = useDeleteAbbreviationMutation();


  const changed = originalAbbreviation === undefined || originalAbbreviation.abbreviation !== abbreviation || originalAbbreviation.word !== word;

  const onSubmit = (): Promise<void> => originalAbbreviation !== undefined
    ? executeMutation(
      () => editAbbreviation({variables: {abbreviation: originalAbbreviation?.abbreviation, abbreviationInput: {abbreviation, word}}}),
      ({abbreviation}) => {
        if (abbreviation?.edit) {
          setState((state) => update(state, {originalAbbreviation: {$set: abbreviation.edit}}));
          onChanged(abbreviation.edit);
        }
      }
    )
    : executeMutation(
      () => submitAbbreviation({variables: {abbreviationInput: {abbreviation, word}}}),
      ({newAbbreviation}) => onChanged(newAbbreviation)
    );

  const onDelete = (): Promise<void> => originalAbbreviation !== undefined
    ? executeMutation(
      () => deleteAbbreviation({variables: {abbreviation: originalAbbreviation.abbreviation}}),
      ({abbreviation}) => abbreviation?.delete && onDeleted()
    )
    : new Promise(() => onDeleted());

  return (
    <tr className="border-t border-slate-500">
      <td className="p-2">
        <input type="text" value={abbreviation} className="p-2 rounded border border-slate-500"
          onChange={(event) => setState((state) => update(state, {abbreviation: {$set: event.target.value}}))}/>
      </td>
      <td className="p-2">
        <input type="text" value={word} className="p-2 rounded border border-slate-500 w-full"
          onChange={(event) => setState((state) => update(state, {word: {$set: event.target.value}}))}/>
      </td>
      <td>
        <button type="button" disabled={!changed || editLoading || submitLoading} className={'p-2 rounded bg-blue-500 text-white disabled:opacity-50'}
          onClick={onSubmit}>
          <UpdateIcon/>
        </button>
        <button type="button" disabled={deleteLoading} className="p-2 rounded bg-red-600 text-white disabled:opacity-50" onClick={onDelete}>
          delete...
        </button>
      </td>
    </tr>
  );
}
