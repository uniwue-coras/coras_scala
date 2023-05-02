import {useState} from 'react';
import {FileLoader} from '../FileLoader';
import {readDocument, readFileOnline} from '../model/docxFileReader';
import {Form, Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {RawSolutionNode} from './solutionEntryNode';
import {Applicability} from '../graphql';
import {SolutionEntryField} from './SolutionEntryField';

interface IProps {
  loading: boolean;
  onSubmit: (values: RawSolutionNode[]) => void;
}

const initialEntries: RawSolutionNode[] = [
  {isSubText: false, text: '', applicability: Applicability.NotSpecified, children: [], extractedParagraphs: []}
];

export function RawSolutionForm({loading, onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [entries, setEntries] = useState<RawSolutionNode[]>(initialEntries);

  const loadFile = async (file: File): Promise<void> => setEntries(readDocument(await readFileOnline(file)));

  return (
    <>
      <FileLoader loadFile={loadFile} accept={'.docx'}/>

      <Formik initialValues={entries} onSubmit={(children) => onSubmit(children)} enableReinitialize>
        {({values}) =>
          <Form>
            {values.map((entry, index) =>
              <SolutionEntryField key={index} entry={entry} index={index} depth={0}/>
            )}

            <button type="submit" className="my-4 p-2 rounded bg-blue-600 text-white w-full" disabled={loading}>{t('commitSolution')}</button>
          </Form>
        }
      </Formik>
    </>
  );
}
