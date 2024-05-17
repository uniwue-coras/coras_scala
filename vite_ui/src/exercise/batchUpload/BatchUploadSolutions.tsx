import { ReactElement, useState } from 'react';
import { WithRouterParams } from '../../WithRouteParams';
import { readExerciseIdParam } from '../../router';
import { WithQuery } from '../../WithQuery';
import { useBatchUplExerciseQuery, useSubmitSolutionMutation } from '../../graphql';
import { isDefined } from '../../funcs';
import { homeUrl } from '../../urls';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MultiFileLoader } from '../../MultiFileLoader';
import { convertTextsToNodes, readFileOnline } from '../../solutionInput/docxFileReader';
import { RawSolutionNode, convertEntries } from '../../solutionInput/solutionEntryNode';
import { ReadBatchUploadSolution } from './ReadBatchUploadSolution';
import { BatchUploadStatus } from './batchUploadStatus';
import { executeMutation } from '../../mutationHelpers';
import update from 'immutability-helper';

interface IProps {
  exerciseId: number;
  exercise: {
    title: string;
    text: string;
  };
}

interface IState {
  illegalFilenames: string[];
  readSolutions: {
    [username: string]: {
      entries: RawSolutionNode[];
      status: BatchUploadStatus
    }
  }
}

function Inner({ exerciseId, exercise }: IProps): ReactElement {

  const { title, text } = exercise;

  const [state, setState] = useState<IState>();
  const { t } = useTranslation('common');
  const [submitSolution] = useSubmitSolutionMutation();

  const loadFiles = async (files: File[]) => {
    const newState: IState = { illegalFilenames: [], readSolutions: {} };

    for (const file of files) {

      const matches = file.name.match(/\s*s\d+/);

      if (matches === null) {
        newState.illegalFilenames.push(file.name);
      } else {
        const docxTexts = await readFileOnline(file);

        newState.readSolutions[matches[0]] = {
          entries: convertTextsToNodes(docxTexts),
          status: BatchUploadStatus.Waiting
        };
      }
    }

    setState(newState);
  };

  const updateUploadStatus = (username: string, uploadStatus: BatchUploadStatus) =>
    setState((state) => update(state, { readSolutions: { [username]: { status: { $set: uploadStatus } } } }));

  const onSubmit = async (username: string) => {
    if (!isDefined(state)) {
      return;
    }

    updateUploadStatus(username, BatchUploadStatus.Uploading);

    const solution = convertEntries(state.readSolutions[username].entries);

    executeMutation(
      () => submitSolution({ variables: { exerciseId, userSolution: { username, solution } } }),
      ({ exerciseMutations }) => {
        const submittedSolution = exerciseMutations?.submitSolution;

        if (isDefined(submittedSolution)) {
          updateUploadStatus(username, BatchUploadStatus.Uploaded);
        } else {
          updateUploadStatus(username, BatchUploadStatus.AlreadyExists);
        }
      },
      () => updateUploadStatus(username, BatchUploadStatus.Error)
    );
  };

  const onSubmitRemaining = async () => {
    if (!isDefined(state)) {
      return;
    }

    Object.entries(state.readSolutions).forEach(([username, { status }]) => {
      status === BatchUploadStatus.Waiting && onSubmit(username);
    });
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center">{t('exercise')} &quot;{title}&quot;</h1>
      <div className="my-4 text-justify">{text.split('\n').map((c, index) => <p key={index}>{c}</p>)}</div>

      {isDefined(state)
        ? (
          <>
            <section className="my-4">
              <h2 className="font-bold text-center text-xl">{t('illegalFilenames')}</h2>

              <ul className="list-disc list-inside">
                {state.illegalFilenames.map((filename) => <li key={filename}>{filename}</li>)}
              </ul>
            </section>

            <section className="my-4">
              <h2 className="font-bold text-center text-xl">{t('readFiles')}</h2>

              <div className="my-4 grid grid-cols-2 gap-2">
                <div className="text-center">
                  <button type="button" className="p-2 rounded bg-blue-600 text-white" onClick={onSubmitRemaining}>{t('uploadRemaining')}</button>
                </div>
                <div className="text-center">
                  <button type="button" className="p-2 rounded bg-red-600 text-white" onClick={() => setState(undefined)}>{t('reset')}</button>
                </div>
              </div>

              {Object.entries(state.readSolutions).map(([username, { entries, status }]) => <ReadBatchUploadSolution key={username} {...{ username, entries, status, onSubmit }} />)}
            </section>
          </>
        )
        : <MultiFileLoader loadFiles={loadFiles} accept=".docx" />}
    </>
  );
}

function WithRouteParamsInner({ exerciseId }: { exerciseId: number }): ReactElement {
  return (
    <WithQuery query={useBatchUplExerciseQuery({ variables: { exerciseId } })}>
      {({ exercise }) => isDefined(exercise)
        ? <Inner {...{ exerciseId, exercise }} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function BatchUploadSolutions(): ReactElement {
  return (
    <div className="container mx-auto py-4">
      <WithRouterParams readParams={readExerciseIdParam}>
        {({ exerciseId }) => <WithRouteParamsInner exerciseId={exerciseId} />}
      </WithRouterParams>
    </div>
  );
}
