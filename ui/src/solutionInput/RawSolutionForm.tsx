import { useState } from 'react';
import {FileLoader} from '../FileLoader';
import {SolutionEntryFieldArray} from './SolutionEntryFieldArray';
import {readDocument, readFile} from '../model/offlineReader';
import {Form, Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {RawSolutionEntry} from './solutionEntryNode';
import {RawSolutionEntryField} from './RawSolutionEntryField';
import {Applicability} from '../graphql';

interface IProps {
  onSubmit: (values: RawSolutionEntry[]) => void;
}

const initialEntries: RawSolutionEntry[] = [
  {text: '', applicability: Applicability.NotSpecified, subTexts: [], children: []}
];

export function RawSolutionForm({onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [entries, setEntries] = useState<RawSolutionEntry[]>(initialEntries);

  async function loadFile(file: File): Promise<void> {
    setEntries(readDocument(await readFile(file)));
  }

  return (
    <>
      <FileLoader loadFile={loadFile} accept={'.docx'}/>

      <Formik initialValues={{children: entries}} onSubmit={({children}) => onSubmit(children)} enableReinitialize>
        {({values}) =>
          <Form>
            <SolutionEntryFieldArray entries={values.children} canMoveChildren canDeleteChildren>
              {(props) => <RawSolutionEntryField {...props}/>}
            </SolutionEntryFieldArray>

            <div className="field">
              <button type="submit" className="button is-link is-fullwidth">{t('analyzeSolution')}</button>
            </div>
          </Form>
        }
      </Formik>
    </>
  );
}
