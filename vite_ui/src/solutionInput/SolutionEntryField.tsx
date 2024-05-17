import { ReactElement, useState } from 'react';
import { RawSolutionNode } from './solutionEntryNode';
import { getBullet } from '../model/bulletTypes';
import { importanceSymbol, stringifyApplicability } from '../model/enums';
import { DownTriangle, RightTriangle } from '../icons';
import classNames from 'classnames';

interface IProps {
  entry: RawSolutionNode;
  index: number;
  depth?: number;
}

export function SolutionEntryField({ entry, index, depth = 0 }: IProps): ReactElement {

  const { isSubText, text, applicability, focusIntensity, children } = entry;

  const [isReduced, setIsReduced] = useState(false);

  return (
    <>
      <div className="my-2 space-x-2">
        {!isSubText && <>
          <span>{getBullet(depth, index)}.</span>
          <button type="button" className="text-slate-500 font-bold disabled:opacity-50" onClick={() => setIsReduced((value) => !value)} disabled={children.length === 0}>
            {isReduced ? <RightTriangle /> : <DownTriangle />}
          </button>
        </>}
        {focusIntensity && <span className="font-bold" title={focusIntensity}>{importanceSymbol(focusIntensity)}</span>}
        <span className={classNames({ 'underline font-bold': focusIntensity !== undefined })}>{text}</span>
        <span className="font-bold">{stringifyApplicability(applicability)}</span>
      </div>

      {!isReduced && <div className="ml-10">
        {children.map((entry, index) => <SolutionEntryField key={index} {...{ entry, index }} depth={depth + 1} />)}
      </div>}
    </>
  );
}
