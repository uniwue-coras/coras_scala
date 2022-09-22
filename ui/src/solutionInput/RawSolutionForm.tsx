import {useState} from 'react';
import {FileLoader} from '../FileLoader';
import {SolutionEntryFieldArray} from './SolutionEntryFieldArray';
import {readDocument, readFileOnline} from '../model/docxFileReader';
import {Form, Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {RawSolutionEntry} from './solutionEntryNode';
import {RawSolutionEntryField} from './RawSolutionEntryField';
import {Applicability} from '../myTsModels';

interface IProps {
  loading: boolean;
  onSubmit: (values: RawSolutionEntry[]) => void;
}

const initialEntries: RawSolutionEntry[] = [
  {text: '', applicability: Applicability.NotSpecified, children: [], subTexts: []}
];

export function RawSolutionForm({loading, onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [entries, setEntries] = useState<RawSolutionEntry[]>(initialEntries);

  async function loadFile(file: File): Promise<void> {
    setEntries(readDocument(await readFileOnline(file)));
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

            <button type="submit" className="my-4 p-2 rounded bg-blue-600 text-white w-full" disabled={loading}>{t('commitSolution')}</button>
          </Form>
        }
      </Formik>
    </>
  );
}
