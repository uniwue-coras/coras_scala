import {getBullet} from './bulletTypes';
import {FieldArray} from 'formik';
import {buildMoveValues, TreeNodeFieldProps} from './SolutionEntryMainField';
import {RawApplicableTextField} from './RawApplicableTextField';
import {HiOutlineChevronDown, HiOutlineChevronRight} from 'react-icons/hi';

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

      {!isReduced && entry.subTexts && <div className="ml-10">
        <FieldArray name={`${name}.subTexts`}>
          {(arrayHelpers) => <>
            {entry.subTexts.map((s, subTextIndex) => <div key={subTextIndex} className="mt-2">
                <RawApplicableTextField name={`${name}.subTexts.${subTextIndex}`}
                                        moveValues={buildMoveValues(subTextIndex, entry.subTexts, arrayHelpers)}
                                        deleteValues={{deleteEntry: () => arrayHelpers.remove(subTextIndex)}}/>
              </div>
            )}
          </>}
        </FieldArray>
      </div>}

    </div>
  );
}
