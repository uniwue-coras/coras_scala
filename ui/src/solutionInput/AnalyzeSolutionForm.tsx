import {AnalyzedSolutionEntry, analyzeRawSolutionEntry, RawSolutionEntry} from './solutionEntryNode';
import {useTranslation} from 'react-i18next';
import {Form, Formik} from 'formik';
import {SolutionEntryFieldArray} from './SolutionEntryFieldArray';
import {AnalyzeSolutionEntryField} from './AnalyzeSolutionEntryField';
import classNames from 'classnames';

interface IProps {
  entries: RawSolutionEntry[];
  onSubmit: (values: AnalyzedSolutionEntry[]) => void;
  loading: boolean;
}

export function AnalyzeSolutionForm({entries, onSubmit, loading}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const initialValues: AnalyzedSolutionEntry[] = entries.map(analyzeRawSolutionEntry);

  return (
    <Formik initialValues={{children: initialValues}} onSubmit={({children}) => onSubmit(children)}>
      {({values}) =>
        <Form>
          <SolutionEntryFieldArray entries={values.children}>
            {(props) => <AnalyzeSolutionEntryField {...props}/>}
          </SolutionEntryFieldArray>

          <button type="submit" className={classNames('my-2', 'p-2', 'rounded', 'bg-blue-600', 'text-white', 'w-full', {'opacity-50': loading})}
                  disabled={loading}>
            {t('submitSolution')}
          </button>
        </Form>
      }
    </Formik>
  );
}
