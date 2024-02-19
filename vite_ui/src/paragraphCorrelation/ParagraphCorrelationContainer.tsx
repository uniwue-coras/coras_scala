import { ReactElement, useState } from "react";
import { WithRouterParams } from "../WithRouteParams";
import { ExerciseIdParams, readExerciseIdParam } from "../router";
import { WithQuery } from "../WithQuery";
import { MatchRevSampleSolNodeFragment, useParagraphCorrelationExerciseDataQuery, useParagraphCorrelationUserSolutionQuery } from "../graphql";
import { homeUrl } from "../urls";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserNameSelector } from "../matchingReview/UserNameSelector";
import { ParagraphCorrelation } from "./ParagraphCorrelation";

interface InnerProps extends ExerciseIdParams {
  sampleSolutionNodes: MatchRevSampleSolNodeFragment[];
  usernames: { username: string }[];
}

function Inner({ exerciseId, sampleSolutionNodes, usernames }: InnerProps): ReactElement {

  const { t } = useTranslation('common');
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const { username } = usernames[currentUserIndex];

  return (
    <div className="px-4 py-2">
      <UserNameSelector {...{ exerciseId, username, currentUserIndex, setCurrentUserIndex }} maxNumber={usernames.length} />

      <WithQuery query={useParagraphCorrelationUserSolutionQuery({ variables: { exerciseId, username } })}>
        {({ exercise }) => exercise?.userSolution
          ? <ParagraphCorrelation {...{ exerciseId, username, sampleSolutionNodes, userSolutionNodes: exercise.userSolution.userSolutionNodes, paragraphCorrelations: exercise.userSolution.paragraphCorrelations }} />
          : <div className="container mx-auto">{t('loadDataError')}</div>}
      </WithQuery>
    </div>
  );
}

function WithRouteParamsInner({ exerciseId }: ExerciseIdParams): ReactElement {
  return (
    <WithQuery query={useParagraphCorrelationExerciseDataQuery({ variables: { exerciseId } })}>
      {({ exercise }) => exercise
        ? <Inner exerciseId={exerciseId} {...exercise} />
        : <Navigate to={homeUrl} />}
    </WithQuery>
  );
}

export function ParagraphCorrelationContainer(): ReactElement {
  return (
    <WithRouterParams readParams={readExerciseIdParam}>
      {(params) => <WithRouteParamsInner {...params} />}
    </WithRouterParams>
  );
}
