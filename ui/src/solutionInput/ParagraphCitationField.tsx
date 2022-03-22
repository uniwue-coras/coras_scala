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
    <>
      <button type="button" className="button" onClick={setMarked}>{isMarked ? <HiCheck/> : <HiX/>}</button>
      <Field type="number" name={`${name}.startIndex`} className="ml-2 input" disabled/>
      <Field type="number" name={`${name}.endIndex`} className="ml-2 input" disabled/>
    </>
  );
}
