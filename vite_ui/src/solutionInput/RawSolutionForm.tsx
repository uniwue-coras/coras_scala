import { ReactElement, useState } from 'react';
import { FileLoader } from '../FileLoader';
import { convertTextsToNodes, readFileOnline } from './docxFileReader';
import { useTranslation } from 'react-i18next';
import { convertEntries, RawSolutionNode } from './solutionEntryNode';
import { SolutionEntryField } from './SolutionEntryField';
import { SolutionNodeInput } from '../graphql';

interface IProps {
  loading: boolean;
  onSubmit: (nodes: SolutionNodeInput[]) => void;
}

export function RawSolutionForm({ loading, onSubmit }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [nodes, setNodes] = useState<RawSolutionNode[]>();

  const loadFile = async (file: File) => {
    const texts = await readFileOnline(file);

    setNodes(convertTextsToNodes(texts));
  };

  const performSubmit = (entries: RawSolutionNode[]): void => {
    const nodes: SolutionNodeInput[] = convertEntries(entries);

    onSubmit(nodes);
  };

  return (
    <>
      <FileLoader loadFile={loadFile} accept={'.docx'} />

      {nodes !== undefined && <>
        {nodes.map((entry, index) => <SolutionEntryField key={index} {...{ entry, index }} />)}

        <button type="button" className="my-4 p-2 rounded bg-blue-600 text-white w-full" disabled={loading} onClick={() => performSubmit(nodes)}>
          {t('commitSolution')}
        </button>
      </>
      }
    </>
  );
}
