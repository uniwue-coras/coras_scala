import {HiOutlineChevronDoubleDown, HiOutlineChevronDoubleUp, HiOutlinePlus, HiOutlineX} from 'react-icons/hi';
import {Field} from 'formik';
import {applicabilityValues, stringifyApplicability} from '../model/applicability';
import {DeleteValues, MoveValues} from './SolutionEntryMainField';

interface IProps {
  priorControls?: JSX.Element;
  name: string;
  moveValues?: MoveValues;
  addChild?: () => void;
  deleteValues?: DeleteValues;
}

export function RawApplicableTextField({priorControls, name, moveValues, addChild, deleteValues}: IProps): JSX.Element {
  return (
    <div className="field has-addons">
      {priorControls && priorControls}

      <div className="control is-expanded">
        <Field name={`${name}.text`} className="input"/>
      </div>

      <div className="control">
        <div className="select is-fullwidth">
          <Field as="select" name={`${name}.applicability`}>
            {applicabilityValues.map((a) => <option key={a} value={a}>{stringifyApplicability(a)}</option>)}
          </Field>
        </div>
      </div>

      {moveValues && <>
        <div className="control">
          <button type="button" className="button" disabled={moveValues.isFirst} onClick={() => moveValues.moveUp()}>
            <HiOutlineChevronDoubleUp/>
          </button>
        </div>
        <div className="control">
          <button type="button" className="button" disabled={moveValues.isLast} onClick={() => moveValues.moveDown()}>
            <HiOutlineChevronDoubleDown/>
          </button>
        </div>
      </>}

      {addChild && <div className="control">
        <button type="button" className="button" disabled={true}>
          <HiOutlinePlus/>
        </button>
      </div>}

      {deleteValues && <div className="control">
        <button type="button" className="button is-danger" disabled={deleteValues.deletionDisabled} onClick={deleteValues.deleteEntry}>
          <HiOutlineX/>
        </button>
      </div>}

    </div>
  );
}
