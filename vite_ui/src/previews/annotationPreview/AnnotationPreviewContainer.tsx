import { ReactElement, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnnotationPreview } from "./AnnotationPreview";
import { UserNameSelector } from "../UserNameSelector";
import { ExerciseIdSelector } from "../ExerciseIdSelector";
import { MatchingReviewSolNodeFragment, useAllExerciseIdsQuery, useAnnotationUserSolutionDataQuery, useAnnotationUsernameSelectionDataQuery } from "../../graphql";
import { WithQuery } from "../../WithQuery";
import { homeUrl } from "../../urls";

interface UsernameSelectorProps {
  exerciseId: number;
  allExerciseIds: number[];
  sampleSolutionNodes: MatchingReviewSolNodeFragment[];
  usernames: { username: string }[];
  setExerciseId: (exerciseId: number) => void;
}

function UsernameSelectorInner({ exerciseId, allExerciseIds, sampleSolutionNodes, usernames, setExerciseId }: UsernameSelectorProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { username } = usernames[currentUserIndex];

  return (
    <div className="px-4 py-2">
      <div className="container mx-auto grid grid-cols-2 gap-2">
        <ExerciseIdSelector exerciseId={exerciseId} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} />
        <UserNameSelector currentUserIndex={currentUserIndex} allUsernames={usernames.map((({ username }) => username))}
          setCurrentUserIndex={setCurrentUserIndex} />
      </div>

      <WithQuery query={useAnnotationUserSolutionDataQuery({ variables: { exerciseId, username } })}>
        {({ exercise }) => exercise?.userSolution
          ? <AnnotationPreview exerciseId={exerciseId} username={username} sampleSolutionNodes={sampleSolutionNodes} userSolutionNodes={exercise.userSolution.userSolutionNodes}
            correctionResult={exercise.userSolution.correctionResult} />
          : <div className="container mx-auto">{t('loadDataError')}</div>}
      </WithQuery>
    </div>
  );
}

interface ExerciseSelectorProps {
  allExerciseIds: number[];
}

function ExerciseSelectorInner({ allExerciseIds }: ExerciseSelectorProps): ReactElement {

  const [exerciseId, setExerciseId] = useState(allExerciseIds[0]);

  return (
    <WithQuery query={useAnnotationUsernameSelectionDataQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <UsernameSelectorInner exerciseId={exerciseId} {...exercise} allExerciseIds={allExerciseIds} setExerciseId={setExerciseId} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function AnnotationPreviewContainer(): ReactElement {
  return (
    <WithQuery query={useAllExerciseIdsQuery()}>
      {({ exercises }) => exercises.length > 0
        ? <ExerciseSelectorInner allExerciseIds={exercises.map(({ id }) => id)} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}
