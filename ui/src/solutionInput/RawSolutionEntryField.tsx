import {getBullet} from './bulletTypes';
import {FieldArray} from 'formik';
import {RawSolutionEntry} from './solutionEntryNode';
import {buildMoveValues, TreeNodeFieldProps} from './SolutionEntryMainField';
import {RawApplicableTextField} from './RawApplicableTextField';
import {HiOutlineChevronDoubleDown, HiOutlineChevronDoubleRight} from 'react-icons/hi';

export function RawSolutionEntryField({
  entry,
  name,
  index,
  depth,
  reduceValues,
  moveValues,
  addChild,
  deleteValues
}: TreeNodeFieldProps<RawSolutionEntry>): JSX.Element {

  const {isReducible, isReduced, toggleIsReduced} = reduceValues;

  const priorControls = (
    <>
      <div className="px-2 py-1 rounded-l border-l border-y border-slate-600">{getBullet(depth, index)}</div>

      {isReducible && <button type="button" className="px-2 py-1 border-l border-y border-slate-600" onClick={toggleIsReduced}>
        {isReduced ? <HiOutlineChevronDoubleRight/> : <HiOutlineChevronDoubleDown/>}
      </button>}
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
