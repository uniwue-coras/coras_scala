import {Field} from 'formik';
import {ParagraphCitationInput} from '../graphql';
import {HiCheck, HiX} from 'react-icons/hi';

interface ParagraphCitationIProps {
  name: string;
  paragraphCitation: ParagraphCitationInput;
  isMarked?: boolean;
  setMarked: () => void;
}

export function ParagraphCitationField({name,/* paragraphCitation,*/ isMarked, setMarked}: ParagraphCitationIProps): JSX.Element {
  return (
    <div className="field has-addons">
      <div className="control">
        <button type="button" className="button" onClick={setMarked}>{isMarked ? <HiCheck/> : <HiX/>}</button>
      </div>
      <div className="control">
        <Field type="number" name={`${name}.startIndex`} className="input" disabled/>
      </div>
      <div className="control">
        <Field type="number" name={`${name}.endIndex`} className="input" disabled/>
      </div>
    </div>
  );
}
