import { ReactElement, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ParagraphCorrelation } from "./ParagraphCorrelation";
import { UserNameSelector } from "../UserNameSelector";
import { ExerciseIdSelector } from "../ExerciseIdSelector";
import { WithQuery } from "../../WithQuery";
import { MatchingReviewSolNodeFragment, useAllExerciseIdsQuery, useParagraphCorrelationExerciseDataQuery, useParagraphCorrelationUserSolutionQuery } from "../../graphql";
import { homeUrl } from "../../urls";

interface InnerProps {
  exerciseId: number;
  allExerciseIds: number[];
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  usernames: { username: string }[];
  setExerciseId: (exerciseId: number) => void;
}

function Inner({ exerciseId, allExerciseIds, sampleSolutionNodes, usernames, setExerciseId }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { username } = usernames[currentUserIndex];

  return (
    <div className="px-4 py-2">
      <div className="container mx-auto grid grid-cols-2 gap-2">
        <ExerciseIdSelector exerciseId={exerciseId} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} />
        <UserNameSelector username={username} currentUserIndex={currentUserIndex} allUsernames={usernames.map(({ username }) => username)}
          setCurrentUserIndex={setCurrentUserIndex} />
      </div>

      <WithQuery query={useParagraphCorrelationUserSolutionQuery({ variables: { exerciseId, username } })}>
        {({ exercise }) => exercise?.userSolution
          ? <ParagraphCorrelation exerciseId={exerciseId} username={username} sampleSolutionNodes={sampleSolutionNodes} userSolutionNodes={exercise.userSolution.userSolutionNodes}
            paragraphCorrelations={exercise.userSolution.paragraphCorrelations} />
          : <div className="container mx-auto">{t('loadDataError')}</div>}
      </WithQuery>
    </div>
  );
}



interface ExerciseSelectorInnerProps {
  allExerciseIds: number[];
}

function ExerciseSelectorInner({ allExerciseIds }: ExerciseSelectorInnerProps): ReactElement {
  const [exerciseId, setExerciseId] = useState(allExerciseIds[0]);

  return (
    <WithQuery query={useParagraphCorrelationExerciseDataQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <Inner exerciseId={exerciseId} {...exercise} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}


export function ParagraphCorrelationContainer(): ReactElement {
  return (
    <WithQuery query={useAllExerciseIdsQuery()}>
      {({ exercises }) => <ExerciseSelectorInner allExerciseIds={exercises.map(({ id }) => id)} />}
    </WithQuery>
  );
}
