import { ReactElement, useState } from 'react';
import { FileLoader } from '../FileLoader';
import { readDocument, readFileOnline } from '../model/docxFileReader';
import { useTranslation } from 'react-i18next';
import { enumerateEntries, flattenNode, RawSolutionNode } from './solutionEntryNode';
import { SolutionEntryField } from './SolutionEntryField';
import { FlatSolutionNodeInput } from '../graphql';

interface IProps {
  loading: boolean;
  onSubmit: (nodes: FlatSolutionNodeInput[]) => void;
}

export function RawSolutionForm({ loading, onSubmit }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [entries, setEntries] = useState<RawSolutionNode[]>();

  const loadFile = async (file: File): Promise<void> => setEntries(readDocument(await readFileOnline(file)));

  const performSubmit = (entries: RawSolutionNode[]): void => onSubmit(
    enumerateEntries(entries).flatMap((n) => flattenNode(n, undefined))
  );

  return (
    <>
      <FileLoader loadFile={loadFile} accept={'.docx'} />

      {entries !== undefined && <>
        {entries.map((entry, index) =>
          <SolutionEntryField key={index} entry={entry} index={index} depth={0} />
        )}

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full" disabled={loading} onClick={() => performSubmit(entries)}>
          {t('commitSolution')}
        </button>
      </>
      }
    </>
  );
}
