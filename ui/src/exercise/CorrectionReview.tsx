import {JSX} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {homeUrl} from '../urls';
import {WithQuery} from '../WithQuery';
import {CorrectionReviewQuery, useCorrectionReviewQuery} from '../graphql';
import {useTranslation} from 'react-i18next';

function Inner({reviewCorrection}: CorrectionReviewQuery): JSX.Element {

  console.info(JSON.stringify(reviewCorrection, null, 2));

  const {t} = useTranslation('common');

  const {sampleSolution, userSolution, matches} = reviewCorrection;

//  const coloredMatches = matches.map<ColoredMatch>((m) => null);

  return (
    <div className="p-2 grid grid-cols-2gap-2">

      TODO!

      {/*
      <section className="px-2 max-h-screen overflow-scroll">
        <h2 className="font-bold text-center">{t('sampleSolution')}</h2>

        {getFlatSolutionNodeChildren(sampleSolution, null).map((sampleRoot) =>
          <SampleSolutionNodeDisplay key={sampleRoot.id} matches={coloredMatches} currentNode={sampleRoot} allNodes={sampleSolution}
            selectedNodeId={undefined} dragProps={undefined}
            onNodeClick={(nodeId) => onNodeClick(SideSelector.Sample, nodeId)} matchEditData={undefined}/>)}
      </section>

      <section className="px-2 max-h-screen overflow-scroll">
        <h2 className="font-bold text-center">{t('learnerSolution')}</h2>

        {getFlatSolutionNodeChildren(userSolution, null).map((userRoot) =>
          <UserSolutionNodeDisplay key={userRoot.id} matches={coloredMatches} currentNode={userRoot} allNodes={userSolution}
            selectedNodeId={undefined} dragProps={undefined} onNodeClick={(nodeId) => onNodeClick(SideSelector.User, nodeId)}
            currentSelection={undefined} annotationEditingProps={{onCancelAnnotationEdit, onUpdateAnnotation, onSubmitAnnotation}}
            onEditAnnotation={undefined} onRemoveAnnotation={undefined} matchEditData={undefined}/>)}
      </section>
      */}

    </div>
  );
}

export function CorrectionReview(): JSX.Element {

  const correctionReviewUuid = useParams<'correctionReviewUuid'>().correctionReviewUuid;

  if (!correctionReviewUuid) {
    return <Navigate to={homeUrl}/>;
  }

  const query = useCorrectionReviewQuery({variables: {correctionReviewUuid}});

  return (
    <WithQuery query={query}>
      {(data) => data
        ? <Inner {...data}/>
        : <Navigate to={homeUrl}/>}
    </WithQuery>
  );
}
