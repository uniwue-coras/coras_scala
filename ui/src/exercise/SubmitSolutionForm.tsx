import { useState } from 'react';
import {AnalyzedSolutionEntry, RawSolutionEntry} from '../solutionInput/solutionEntryNode';
import {RawSolutionForm} from '../solutionInput/RawSolutionForm';
import {AnalyzeSolutionForm} from '../solutionInput/AnalyzeSolutionForm';

interface IProps {
  onSubmit: (entrie: AnalyzedSolutionEntry[]) => void;
  loading: boolean;
}

export function SubmitSolutionForm({onSubmit, loading}: IProps): JSX.Element {

  const [rawSolution, setRawSolution] = useState<RawSolutionEntry[]>();

  return rawSolution
    ? <AnalyzeSolutionForm entries={rawSolution} onSubmit={onSubmit} loading={loading}/>
    : <RawSolutionForm onSubmit={setRawSolution}/>;
}