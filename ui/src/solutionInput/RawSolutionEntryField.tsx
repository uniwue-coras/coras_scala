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
      <div className="control">
        <div className="button is-static">{getBullet(depth, index)}</div>
      </div>

      {isReducible && <div className="control">
        <button type="button" className="button" onClick={toggleIsReduced}>
          {isReduced ? <HiOutlineChevronDoubleRight/> : <HiOutlineChevronDoubleDown/>}
        </button>
      </div>}
    </>
  );

  return (
    <div className="my-3">
      <RawApplicableTextField priorControls={priorControls} name={name} moveValues={moveValues} addChild={addChild}
                              deleteValues={deleteValues}/>

      {!isReduced && entry.subTexts && <div className="indented">
        <FieldArray name={`${name}.subTexts`}>
          {(arrayHelpers) => <>
            {entry.subTexts.map((s, subTextIndex) =>
              <RawApplicableTextField key={subTextIndex} name={`${name}.subTexts.${subTextIndex}`}
                                      moveValues={buildMoveValues(subTextIndex, entry.subTexts, arrayHelpers)}
                                      deleteValues={{deleteEntry: () => arrayHelpers.remove(subTextIndex)}}/>
            )}
          </>}
        </FieldArray>
      </div>}

    </div>
  );
}
