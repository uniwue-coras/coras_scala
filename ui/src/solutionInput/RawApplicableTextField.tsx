import {HiOutlineChevronDoubleDown, HiOutlineChevronDoubleUp, HiOutlinePlus} from 'react-icons/hi';
import {Field} from 'formik';
import {applicabilityValues, stringifyApplicability} from '../model/applicability';
import {DeleteValues, MoveValues} from './solutionEntryMainField';
import classNames from 'classnames';

interface IProps {
  priorControls?: JSX.Element;
  name: string;
  moveValues?: MoveValues;
  addChild?: () => void;
  deleteValues?: DeleteValues;
}

export function RawApplicableTextField({priorControls, name, moveValues, addChild, deleteValues}: IProps): JSX.Element {
  return (
    <div className="flex">
      {priorControls && priorControls}

      <Field name={`${name}.text`} className="ml-2 px-2 py-1 rounded-l flex-grow border-l border-y border-slate-600"/>

      <Field as="select" name={`${name}.applicability`} className="px-2 py-1 bg-white border-l border-y border-slate-600">
        {applicabilityValues.map((a) => <option key={a} value={a}>{stringifyApplicability(a)}</option>)}
      </Field>

      {moveValues && <>
        <button type="button" className="px-2 py-1 border-l border-y border-slate-600" disabled={moveValues.isFirst} onClick={() => moveValues.moveUp()}>
          <HiOutlineChevronDoubleUp/>
        </button>
        <button type="button" className="px-2 py-1 border-l border-y border-slate-600" disabled={moveValues.isLast} onClick={() => moveValues.moveDown()}>
          <HiOutlineChevronDoubleDown/>
        </button>
      </>}

      {addChild &&
        <button type="button" className={classNames('px-2 py-1 border border-slate-600', {'rounded-r': deleteValues})} disabled={true}>
          <HiOutlinePlus/>
        </button>}

      {deleteValues &&
        <button type="button" className={classNames('px-2 py-1 rounded-r bg-red-600 text-white', {'opacity-50': deleteValues.deletionDisabled})}
                disabled={deleteValues.deletionDisabled} onClick={deleteValues.deleteEntry}>
          &#10006;
        </button>}

    </div>
  );
}
