import { ReactElement, useState } from 'react';
import { RawSolutionNode } from '../../solutionInput/solutionEntryNode';
import { SolutionEntryField } from '../../solutionInput/SolutionEntryField';
import { CheckmarkIcon, DoubleExclamationMarkIcon, DownTriangle, RightTriangle, SheepIcon, UploadIcon } from '../../icons';
import { BatchUploadStatus } from './batchUploadStatus';
import { useTranslation } from 'react-i18next';

interface IProps {
  username: string;
  entries: RawSolutionNode[];
  status: BatchUploadStatus;
  onSubmit: (username: string) => void;
}

export function ReadBatchUploadSolution({ username, entries, status, onSubmit }: IProps): ReactElement {

  const { t } = useTranslation('common');
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div className="my-4 rounded border border-slate-500">

      <h3 className="p-2 border-bottom border-slate-500 flex flex-row space-x-2">
        <button type="button" onClick={() => setIsMinimized((minimized) => !minimized)}>{isMinimized ? <RightTriangle /> : <DownTriangle />}</button>
        <span>{username}</span>
        <div className="flex-grow" />

        {{
          [BatchUploadStatus.Waiting]: <button type="button" className="text-blue-600 font-bold" onClick={() => onSubmit(username)}><UploadIcon /></button>,
          [BatchUploadStatus.Uploading]: <span className="text-cyan-600 font-bold animate-spin"><UploadIcon /></span>,
          [BatchUploadStatus.Uploaded]: <span className="text-green-600 font-bold"><CheckmarkIcon /></span>,
          [BatchUploadStatus.AlreadyExists]: <span className="text-amber-600 font-bold" title={t('alreadyExists')}><SheepIcon /></span>,
          [BatchUploadStatus.Error]: <span className="text-red-600 font-bold" title={t('')}><DoubleExclamationMarkIcon /></span>
        }[status]}
      </h3>

      {!isMinimized && <div className="p-2">
        {entries.map((entry, index) => <SolutionEntryField key={index} {...{ entry, index }} />)}
      </div>}
    </div>
  );
}
