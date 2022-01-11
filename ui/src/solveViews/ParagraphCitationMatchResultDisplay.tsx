import {stringifyParagraphCitation} from '../model/analysis/paragraphExtractor';
import {useTranslation} from 'react-i18next';
import { Fragment } from 'react';
import {ParagraphMatchingResult} from '../model/correction/paragraphMatcher';

interface IProps {
  result: ParagraphMatchingResult;
}

export function ParagraphCitationMatchResultRows({result}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const {certainMatches, ambiguousMatches, notMatchedUser, notMatchedSample} = result;

  const correct = ambiguousMatches.length === 0 && notMatchedUser.length === 0 && notMatchedSample.length === 0;

  return (
    <>
      <tr>
        <td className="has-text-weight-bold">{correct ? <span>&#10004;</span> : <span>&#10008;</span>} {t('citedParagraphs')}</td>
        <td/>
        <td/>
      </tr>

      {certainMatches.map(({userSolutionEntry, sampleSolutionEntry/*, matchResult*/}, index) => <Fragment key={index}>
        <tr>
          <td/>
          <td className="has-text-success">{stringifyParagraphCitation(userSolutionEntry)}</td>
          <td>{stringifyParagraphCitation(sampleSolutionEntry)}</td>
        </tr>
        <tr>
          <td colSpan={3}>
            <input type="text" className="input" defaultValue="Korrekt"/>
          </td>
        </tr>
      </Fragment>)}

      {ambiguousMatches.map(({userSolutionEntry, sampleSolutionEntry/*, matchResult*/}, index) => <Fragment key={index}>
        <tr>
          <td/>
          <td className="has-text-warning">{stringifyParagraphCitation(userSolutionEntry)}</td>
          <td>{stringifyParagraphCitation(sampleSolutionEntry)}</td>
        </tr>
        <tr>
          <td colSpan={3}>
            <input type="text" className="input" defaultValue="Teilweise korrekt"/>
          </td>
        </tr>
      </Fragment>)}

      {notMatchedUser.map((citedParagraph, index) => <Fragment key={index}>
        <tr key={index}>
          <td/>
          <td className="has-text-danger">{stringifyParagraphCitation(citedParagraph)}</td>
          <td/>
        </tr>
        <tr>
          <td colSpan={3}>
            <input type="text" className="input" defaultValue="Falsch"/>
          </td>
        </tr>
      </Fragment>)}

      {notMatchedSample.map((citedParagraph, index) => <Fragment key={index}>
        <tr>
          <td/>
          <td/>
          <td className="has-text-danger">{stringifyParagraphCitation(citedParagraph)}</td>
        </tr>
        <tr>
          <td colSpan={3}>
            <input type="text" className="input" defaultValue="Fehlt"/>
          </td>
        </tr>
      </Fragment>)}
    </>
  );
}
