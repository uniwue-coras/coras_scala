import {useState} from 'react';
import {RawSolutionNode} from './solutionEntryNode';
import {useTranslation} from 'react-i18next';
import update from 'immutability-helper';
import classNames from 'classnames';
import {getBullet} from './bulletTypes';
import {stringifyApplicability} from '../model/applicability';

interface IProps {
  entry: RawSolutionNode;
  index: number;
  depth: number;
}

interface IState {
  isReduced: boolean;
  hoveredParagraphCitation: number | undefined;
}

export function SolutionEntryField({entry, index, depth}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({isReduced: false, hoveredParagraphCitation: undefined});

  const {isSubText, text, applicability, children, extractedParagraphs} = entry;

  const toggleIsReduced = () => setState((state) => update(state, {isReduced: (value) => !value}));
  const setParCitHover = (index: number | undefined) => setState((state) => update(state, {hoveredParagraphCitation: {$set: index}}));

  const hoveredParagraph = state.hoveredParagraphCitation !== undefined
    ? entry.extractedParagraphs[state.hoveredParagraphCitation]
    : undefined;

  return (
    <>
      <div className="my-2">
        {!isSubText && <span className="p-1">{getBullet(depth, index)}.</span>}

        {children.length > 0 && <button type="button" className="p-1 text-slate-500 font-bold" onClick={toggleIsReduced}>
          {state.isReduced ? <span>&gt;</span> : <span>&#x2335;</span>}
        </button>}

        &nbsp;

        {hoveredParagraph !== undefined
          ? (
            <>
              <span>{text.substring(0, hoveredParagraph.from)}</span>
              <span className="font-bold">{text.substring(hoveredParagraph.from, hoveredParagraph.to)}</span>
              <span>{text.substring(hoveredParagraph.to)}</span>
            </>
          )
          : text}

        &nbsp;

        {stringifyApplicability(applicability)}
      </div>

      {!state.isReduced && <div className="my-2 ml-10">
        {extractedParagraphs.length > 0 && <div>
          <span className="font-bold">{t('citedParagraphs')}:&nbsp;</span>

          {entry.extractedParagraphs.map(({paragraphType, lawCode, rest}, index) =>
            <span key={index}>
              <code onMouseEnter={() => setParCitHover(index)} onMouseLeave={() => setParCitHover(undefined)}
                    className={classNames({'font-bold': index === state.hoveredParagraphCitation})}>
                {paragraphType} {lawCode} {rest}
              </code>
              {index < entry.extractedParagraphs.length - 1 && <span>, </span>}
            </span>)}
        </div>}

        {children.map((entry, index) =>
          <SolutionEntryField key={index} entry={entry} index={index} depth={depth + 1}/>
        )}
      </div>}
    </>
  );
}
