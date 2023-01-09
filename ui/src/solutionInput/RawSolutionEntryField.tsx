import {getBullet} from './bulletTypes';
import {TreeNodeFieldProps} from './solutionEntryMainField';
import {RawApplicableTextField} from './RawApplicableTextField';
import {HiOutlineChevronDown, HiOutlineChevronRight} from 'react-icons/hi';
import {Field} from 'formik';

export function RawSolutionEntryField({entry, name, index, depth, reduceValues, moveValues, addChild, deleteValues}: TreeNodeFieldProps): JSX.Element {

  const {isReducible, isReduced, toggleIsReduced} = reduceValues;

  const priorControls = (
    <>
      {isReducible && <button type="button" className="p-1 text-slate-500" onClick={toggleIsReduced}>
        {isReduced ? <HiOutlineChevronRight/> : <HiOutlineChevronDown/>}
      </button>}

      <div className="p-1">{getBullet(depth, index)}.</div>
    </>
  );


  return (
    <div className="mt-2">
      <RawApplicableTextField priorControls={priorControls} name={name} moveValues={moveValues} addChild={addChild} deleteValues={deleteValues}/>

      {!isReduced && entry.subText && <div className="ml-10 mt-2">
        <Field as="textarea" name={`${name}.subText`} className="p-2 rounded border border-slate-500 w-full"/>
      </div>}

    </div>
  );
}
