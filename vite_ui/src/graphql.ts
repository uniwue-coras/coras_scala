import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Abbreviation = {
  abbreviation: Scalars['String']['output'];
  word: Scalars['String']['output'];
};

export type AbbreviationInput = {
  abbreviation: Scalars['String']['input'];
  word: Scalars['String']['input'];
};

export type AbbreviationMutations = {
  delete: Abbreviation;
  edit: Abbreviation;
};


export type AbbreviationMutationsEditArgs = {
  abbreviationInput: AbbreviationInput;
};

export type Annotation = {
  annotationType: AnnotationType;
  endIndex: Scalars['Int']['output'];
  errorType: ErrorType;
  id: Scalars['Int']['output'];
  importance: Importance;
  startIndex: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type AnnotationInput = {
  endIndex: Scalars['Int']['input'];
  errorType: ErrorType;
  importance: Importance;
  startIndex: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type AnnotationMutations = {
  delete: Scalars['Int']['output'];
  update: Annotation;
};


export type AnnotationMutationsUpdateArgs = {
  annotation: AnnotationInput;
};

export enum AnnotationType {
  Automatic = 'Automatic',
  Manual = 'Manual',
  RejectedAutomatic = 'RejectedAutomatic'
}

export enum Applicability {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable',
  NotSpecified = 'NotSpecified'
}

export type CorrectionSummary = {
  comment: Scalars['String']['output'];
  points: Scalars['Int']['output'];
};

export enum Correctness {
  Correct = 'Correct',
  Partially = 'Partially',
  Unspecified = 'Unspecified',
  Wrong = 'Wrong'
}

export enum ErrorType {
  Missing = 'Missing',
  Neutral = 'Neutral',
  Wrong = 'Wrong'
}

export type Exercise = {
  id: Scalars['Int']['output'];
  sampleSolution: Array<SampleSolutionNode>;
  text: Scalars['String']['output'];
  textBlocks: Array<ExerciseTextBlock>;
  title: Scalars['String']['output'];
  userSolution?: Maybe<UserSolution>;
  userSolutions: Array<UserSolution>;
};


export type ExerciseUserSolutionArgs = {
  username: Scalars['String']['input'];
};

export type ExerciseBlockGroupMutations = {
  delete: ExerciseTextBlock;
  swap: ExerciseTextBlock;
  update: ExerciseTextBlock;
};


export type ExerciseBlockGroupMutationsSwapArgs = {
  secondBlockId: Scalars['Int']['input'];
};


export type ExerciseBlockGroupMutationsUpdateArgs = {
  textBlock: ExerciseTextBlockInput;
};

export type ExerciseInput = {
  sampleSolution: Array<SolutionNodeInput>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ExerciseMutations = {
  submitSolution?: Maybe<UserSolution>;
  submitTextBlock: ExerciseTextBlock;
  textBlock?: Maybe<ExerciseBlockGroupMutations>;
  userSolution?: Maybe<UserSolutionMutations>;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: UserSolutionInput;
};


export type ExerciseMutationsSubmitTextBlockArgs = {
  textBlock: ExerciseTextBlockInput;
};


export type ExerciseMutationsTextBlockArgs = {
  blockId: Scalars['Int']['input'];
};


export type ExerciseMutationsUserSolutionArgs = {
  username: Scalars['String']['input'];
};

export type ExerciseTextBlock = {
  ends: Array<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  startText: Scalars['String']['output'];
};

export type ExerciseTextBlockInput = {
  ends: Array<Scalars['String']['input']>;
  startText: Scalars['String']['input'];
};

export type ExplanationAnnotation = {
  sampleNodeId: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type ExplanationAnnotationMutations = {
  delete: ExplanationAnnotation;
  edit: Scalars['String']['output'];
};


export type ExplanationAnnotationMutationsEditArgs = {
  text: Scalars['String']['input'];
};

export type IParagraphSynonymIdentifier = {
  lawCode: Scalars['String']['output'];
  paragraph: Scalars['String']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['String']['output'];
};

export enum Importance {
  Less = 'Less',
  Medium = 'Medium',
  More = 'More'
}

export enum MatchStatus {
  Automatic = 'Automatic',
  Deleted = 'Deleted',
  Manual = 'Manual'
}

export type Mutation = {
  abbreviation?: Maybe<AbbreviationMutations>;
  changePassword: Scalars['Boolean']['output'];
  changeRights: Rights;
  claimJwt?: Maybe<Scalars['String']['output']>;
  createEmptyRelatedWordsGroup: Scalars['Int']['output'];
  createExercise: Scalars['Int']['output'];
  createParagraphSynonym: ParagraphSynonym;
  deleteParagraphSynonym: ParagraphSynonymIdentifier;
  exerciseMutations?: Maybe<ExerciseMutations>;
  login: Scalars['String']['output'];
  register: Scalars['String']['output'];
  relatedWordsGroup?: Maybe<RelatedWordGroupMutations>;
  submitNewAbbreviation: Abbreviation;
  updateParagraphSynonym: ParagraphSynonym;
};


export type MutationAbbreviationArgs = {
  abbreviation: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
};


export type MutationChangeRightsArgs = {
  newRights: Rights;
  username: Scalars['String']['input'];
};


export type MutationClaimJwtArgs = {
  ltiUuid: Scalars['String']['input'];
};


export type MutationCreateExerciseArgs = {
  exerciseInput: ExerciseInput;
};


export type MutationCreateParagraphSynonymArgs = {
  paragraphSynonymInput: ParagraphSynonymInput;
};


export type MutationDeleteParagraphSynonymArgs = {
  paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput;
};


export type MutationExerciseMutationsArgs = {
  exerciseId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRelatedWordsGroupArgs = {
  groupId: Scalars['Int']['input'];
};


export type MutationSubmitNewAbbreviationArgs = {
  abbreviationInput: AbbreviationInput;
};


export type MutationUpdateParagraphSynonymArgs = {
  maybeSentenceNumber?: InputMaybe<Scalars['String']['input']>;
  paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput;
  synonym: Scalars['String']['input'];
};

export type ParagraphCitation = {
  alternative?: Maybe<Scalars['String']['output']>;
  identifier: ParagraphSynonymIdentifier;
  lawCode: Scalars['String']['output'];
  number?: Maybe<Scalars['String']['output']>;
  paragraph: Scalars['String']['output'];
  paragraphType: Scalars['String']['output'];
  section?: Maybe<Scalars['String']['output']>;
  sentence?: Maybe<Scalars['String']['output']>;
};

export type ParagraphCitationAnnotation = {
  awaitedParagraph: Scalars['String']['output'];
  citedParagraph?: Maybe<Scalars['String']['output']>;
  correctness: Correctness;
  explanation?: Maybe<Scalars['String']['output']>;
  explanationRecommendations: Array<Scalars['String']['output']>;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type ParagraphCitationAnnotationInput = {
  awaitedParagraph: Scalars['String']['input'];
  citedParagraph?: InputMaybe<Scalars['String']['input']>;
  correctness: Correctness;
  explanation?: InputMaybe<Scalars['String']['input']>;
};

export type ParagraphCitationAnnotationMutation = {
  delete: ParagraphCitationAnnotation;
  update: ParagraphCitationAnnotation;
};


export type ParagraphCitationAnnotationMutationUpdateArgs = {
  paragraphCitationAnnotation: ParagraphCitationAnnotationInput;
};

export type ParagraphCitationLocation = {
  citedParagraphs: Array<ParagraphCitation>;
  from: Scalars['Int']['output'];
  rest: Scalars['String']['output'];
  to: Scalars['Int']['output'];
};

export type ParagraphSynonym = IParagraphSynonymIdentifier & {
  lawCode: Scalars['String']['output'];
  paragraph: Scalars['String']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['String']['output'];
  sentenceNumber?: Maybe<Scalars['String']['output']>;
  synonym: Scalars['String']['output'];
};

export type ParagraphSynonymIdentifier = IParagraphSynonymIdentifier & {
  lawCode: Scalars['String']['output'];
  paragraph: Scalars['String']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['String']['output'];
};

export type ParagraphSynonymIdentifierInput = {
  lawCode: Scalars['String']['input'];
  paragraph: Scalars['String']['input'];
  paragraphType: Scalars['String']['input'];
  section: Scalars['String']['input'];
};

export type ParagraphSynonymInput = {
  lawCode: Scalars['String']['input'];
  paragraph: Scalars['String']['input'];
  paragraphType: Scalars['String']['input'];
  section: Scalars['String']['input'];
  sentenceNumber?: InputMaybe<Scalars['String']['input']>;
  synonym: Scalars['String']['input'];
};

export type Query = {
  abbreviations: Array<Abbreviation>;
  exercise?: Maybe<Exercise>;
  exercises: Array<Exercise>;
  mySolutions: Array<SolutionIdentifier>;
  paragraphSynonyms: Array<ParagraphSynonym>;
  relatedWordGroups: Array<RelatedWordsGroup>;
  reviewCorrection: ReviewData;
  reviewCorrectionByUuid?: Maybe<ReviewData>;
  users: Array<User>;
};


export type QueryExerciseArgs = {
  exerciseId: Scalars['Int']['input'];
};


export type QueryReviewCorrectionArgs = {
  exerciseId: Scalars['Int']['input'];
};


export type QueryReviewCorrectionByUuidArgs = {
  uuid: Scalars['String']['input'];
};

export type RelatedWord = {
  isPositive: Scalars['Boolean']['output'];
  word: Scalars['String']['output'];
};

export type RelatedWordGroupMutations = {
  delete: Scalars['Boolean']['output'];
  relatedWord?: Maybe<RelatedWordMutations>;
  submitRelatedWord: RelatedWord;
};


export type RelatedWordGroupMutationsRelatedWordArgs = {
  word: Scalars['String']['input'];
};


export type RelatedWordGroupMutationsSubmitRelatedWordArgs = {
  relatedWordInput: RelatedWordInput;
};

export type RelatedWordInput = {
  isPositive: Scalars['Boolean']['input'];
  word: Scalars['String']['input'];
};

export type RelatedWordMutations = {
  delete: RelatedWord;
  edit: RelatedWord;
};


export type RelatedWordMutationsEditArgs = {
  relatedWordInput: RelatedWordInput;
};

export type RelatedWordsGroup = {
  content: Array<RelatedWord>;
  groupId: Scalars['Int']['output'];
};

export type ReviewData = {
  comment: Scalars['String']['output'];
  matches: Array<SolutionNodeMatch>;
  points: Scalars['Int']['output'];
  sampleSolution: Array<SampleSolutionNode>;
  userSolution: Array<UserSolutionNode>;
};

export enum Rights {
  Admin = 'Admin',
  Corrector = 'Corrector',
  Student = 'Student'
}

export type SampleSolutionNode = SolutionNode & {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  focusIntensity?: Maybe<Importance>;
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  subTexts: Array<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};

export type SolutionIdentifier = {
  correctionFinished?: Maybe<Scalars['Boolean']['output']>;
  exerciseId: Scalars['Int']['output'];
  exerciseTitle: Scalars['String']['output'];
};

export type SolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  focusIntensity?: Maybe<Importance>;
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type SolutionNodeInput = {
  applicability: Applicability;
  childIndex: Scalars['Int']['input'];
  focusIntensity?: InputMaybe<Importance>;
  id: Scalars['Int']['input'];
  isSubText: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type SolutionNodeMatch = {
  certainty?: Maybe<Scalars['Float']['output']>;
  explanationAnnotationRecommendations: Array<Scalars['String']['output']>;
  explanationAnnotations: Array<ExplanationAnnotation>;
  explanationCorrectness: Correctness;
  matchStatus: MatchStatus;
  paragraphCitationAnnotation?: Maybe<ParagraphCitationAnnotation>;
  paragraphCitationAnnotations: Array<ParagraphCitationAnnotation>;
  paragraphCitationCorrectness: Correctness;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};


export type SolutionNodeMatchParagraphCitationAnnotationArgs = {
  awaitedParagraph: Scalars['String']['input'];
};

export type SolutionNodeMatchMutations = {
  delete: SolutionNodeMatch;
  explanationAnnotation?: Maybe<ExplanationAnnotationMutations>;
  paragraphCitationAnnotation?: Maybe<ParagraphCitationAnnotationMutation>;
  submitExplanationAnnotation: ExplanationAnnotation;
  submitParagraphCitationAnnotation: ParagraphCitationAnnotation;
  updateExplanationCorrectness: Correctness;
  updateParagraphCitationCorrectness: Correctness;
};


export type SolutionNodeMatchMutationsExplanationAnnotationArgs = {
  text: Scalars['String']['input'];
};


export type SolutionNodeMatchMutationsParagraphCitationAnnotationArgs = {
  awaitedParagraph: Scalars['String']['input'];
};


export type SolutionNodeMatchMutationsSubmitExplanationAnnotationArgs = {
  text: Scalars['String']['input'];
};


export type SolutionNodeMatchMutationsSubmitParagraphCitationAnnotationArgs = {
  paragraphCitationAnnotation: ParagraphCitationAnnotationInput;
};


export type SolutionNodeMatchMutationsUpdateExplanationCorrectnessArgs = {
  newCorrectness: Correctness;
};


export type SolutionNodeMatchMutationsUpdateParagraphCitationCorrectnessArgs = {
  newCorrectness: Correctness;
};

export type User = {
  rights: Rights;
  username: Scalars['String']['output'];
};

export type UserSolution = {
  correctionFinished: Scalars['Boolean']['output'];
  correctionSummary?: Maybe<CorrectionSummary>;
  matches: Array<SolutionNodeMatch>;
  node?: Maybe<UserSolutionNode>;
  nodes: Array<UserSolutionNode>;
  username: Scalars['String']['output'];
};


export type UserSolutionNodeArgs = {
  userSolutionNodeId: Scalars['Int']['input'];
};

export type UserSolutionInput = {
  solution: Array<SolutionNodeInput>;
  username: Scalars['String']['input'];
};

export type UserSolutionMutations = {
  finishCorrection: Scalars['Boolean']['output'];
  node?: Maybe<UserSolutionNodeMutations>;
  updateCorrectionResult: CorrectionSummary;
};


export type UserSolutionMutationsNodeArgs = {
  userSolutionNodeId: Scalars['Int']['input'];
};


export type UserSolutionMutationsUpdateCorrectionResultArgs = {
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
};

export type UserSolutionNode = SolutionNode & {
  annotations: Array<Annotation>;
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  focusIntensity?: Maybe<Importance>;
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  match?: Maybe<SolutionNodeMatch>;
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};


export type UserSolutionNodeMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};

export type UserSolutionNodeMutations = {
  annotation?: Maybe<AnnotationMutations>;
  match?: Maybe<SolutionNodeMatchMutations>;
  submitAnnotation: Annotation;
  submitMatch: Array<SolutionNodeMatch>;
};


export type UserSolutionNodeMutationsAnnotationArgs = {
  annotationId: Scalars['Int']['input'];
};


export type UserSolutionNodeMutationsMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};


export type UserSolutionNodeMutationsSubmitAnnotationArgs = {
  annotation: AnnotationInput;
};


export type UserSolutionNodeMutationsSubmitMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};

export type SubmitNewMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type SubmitNewMatchMutation = { exerciseMutations?: { userSolution?: { node?: { submitMatch: Array<SolutionNodeMatchFragment> } | null } | null } | null };

export type DeleteMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type DeleteMatchMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { delete: SolutionNodeMatchFragment } | null } | null } | null } | null };

export type UpdateParagraphCitationCorrectnessMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  newCorrectness: Correctness;
}>;


export type UpdateParagraphCitationCorrectnessMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { newParagraphCitationCorrectness: Correctness } | null } | null } | null } | null };

export type CreateParagraphCitationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  paragraphCitationAnnotation: ParagraphCitationAnnotationInput;
}>;


export type CreateParagraphCitationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { submitParagraphCitationAnnotation: ParagraphCitationAnnotationFragment } | null } | null } | null } | null };

export type GetParagraphCitationAnnotationTextRecommendationsQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  awaitedParagraph: Scalars['String']['input'];
}>;


export type GetParagraphCitationAnnotationTextRecommendationsQuery = { exercise?: { userSolution?: { node?: { match?: { paragraphCitationAnnotation?: { explanationRecommendations: Array<string> } | null } | null } | null } | null } | null };

export type UpdateParagraphCitationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  awaitedParagraph: Scalars['String']['input'];
  paragraphCitationAnnotation: ParagraphCitationAnnotationInput;
}>;


export type UpdateParagraphCitationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { paragraphCitationAnnotation?: { newValues: ParagraphCitationAnnotationFragment } | null } | null } | null } | null } | null };

export type DeleteParagraphCitationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  awaitedParagraph: Scalars['String']['input'];
}>;


export type DeleteParagraphCitationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { paragraphCitationAnnotation?: { delete: ParagraphCitationAnnotationFragment } | null } | null } | null } | null } | null };

export type UpdateExplanationCorrectnessMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  newCorrectness: Correctness;
}>;


export type UpdateExplanationCorrectnessMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { newExplanationCorrectness: Correctness } | null } | null } | null } | null };

export type SubmitExplanationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
}>;


export type SubmitExplanationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { submitExplanationAnnotation: ExplanationAnnotationFragment } | null } | null } | null } | null };

export type GetExplanationAnnotationTextRecommendationsQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type GetExplanationAnnotationTextRecommendationsQuery = { exercise?: { userSolution?: { node?: { match?: { explanationAnnotationRecommendations: Array<string> } | null } | null } | null } | null };

export type UpdateExplanationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  oldText: Scalars['String']['input'];
  text: Scalars['String']['input'];
}>;


export type UpdateExplanationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { explanationAnnotation?: { edit: string } | null } | null } | null } | null } | null };

export type DeleteExplanationAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
  text: Scalars['String']['input'];
}>;


export type DeleteExplanationAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { match?: { explanationAnnotation?: { delete: ExplanationAnnotationFragment } | null } | null } | null } | null } | null };

export type SubmitAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  nodeId: Scalars['Int']['input'];
  annotationInput: AnnotationInput;
}>;


export type SubmitAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { submitAnnotation: AnnotationFragment } | null } | null } | null };

export type UpdateAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  nodeId: Scalars['Int']['input'];
  annotationId: Scalars['Int']['input'];
  annotationInput: AnnotationInput;
}>;


export type UpdateAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { annotation?: { update: AnnotationFragment } | null } | null } | null } | null };

export type DeleteAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  userSolutionNodeId: Scalars['Int']['input'];
  annotationId: Scalars['Int']['input'];
}>;


export type DeleteAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { annotation?: { delete: number } | null } | null } | null } | null };

export type UpsertCorrectionSummaryMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
}>;


export type UpsertCorrectionSummaryMutation = { exerciseMutations?: { userSolution?: { updateCorrectionResult: CorrectionSummaryFragment } | null } | null };

export type FinishCorrectionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type FinishCorrectionMutation = { exerciseMutations?: { userSolution?: { finishCorrection: boolean } | null } | null };

export type SolutionNodeMatchFragment = { sampleNodeId: number, userNodeId: number, matchStatus: MatchStatus, certainty?: number | null, paragraphCitationCorrectness: Correctness, explanationCorrectness: Correctness, paragraphCitationAnnotations: Array<ParagraphCitationAnnotationFragment>, explanationAnnotations: Array<ExplanationAnnotationFragment> };

type SolutionNode_SampleSolutionNode_Fragment = { id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, focusIntensity?: Importance | null, parentId?: number | null };

type SolutionNode_UserSolutionNode_Fragment = { id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, focusIntensity?: Importance | null, parentId?: number | null };

export type SolutionNodeFragment = SolutionNode_SampleSolutionNode_Fragment | SolutionNode_UserSolutionNode_Fragment;

export type SampleSolutionNodeFragment = (
  { subTexts: Array<string> }
  & SolutionNode_SampleSolutionNode_Fragment
);

export type AnnotationFragment = { id: number, errorType: ErrorType, importance: Importance, startIndex: number, endIndex: number, text: string };

export type ParagraphCitationAnnotationFragment = { awaitedParagraph: string, correctness: Correctness, citedParagraph?: string | null, explanation?: string | null };

export type ExplanationAnnotationFragment = { sampleNodeId: number, userNodeId: number, text: string };

export type UserSolutionNodeFragment = (
  { annotations: Array<AnnotationFragment> }
  & SolutionNode_UserSolutionNode_Fragment
);

export type CorrectionSummaryFragment = { comment: string, points: number };

export type UserSolutionFragment = { userSolutionNodes: Array<UserSolutionNodeFragment>, matches: Array<SolutionNodeMatchFragment>, correctionSummary?: CorrectionSummaryFragment | null };

export type CorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type CorrectionQuery = { exercise?: { sampleSolution: Array<SampleSolutionNodeFragment>, userSolution?: UserSolutionFragment | null, textBlocks: Array<ExerciseTextBlockFragment> } | null };

export type BatchUplExerciseQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type BatchUplExerciseQuery = { exercise?: { title: string, text: string } | null };

export type ReviewDataFragment = { comment: string, points: number, userSolution: Array<UserSolutionNodeFragment>, sampleSolution: Array<SolutionNode_SampleSolutionNode_Fragment>, matches: Array<SolutionNodeMatchFragment> };

export type CorrectionReviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type CorrectionReviewQuery = { reviewCorrection: ReviewDataFragment };

export type CorrectionReviewByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CorrectionReviewByUuidQuery = { reviewCorrectionByUuid?: ReviewDataFragment | null };

export type AbbreviationFragment = { abbreviation: string, word: string };

export type AbbreviationManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type AbbreviationManagementQuery = { abbreviations: Array<AbbreviationFragment> };

export type SubmitAbbreviationMutationVariables = Exact<{
  abbreviationInput: AbbreviationInput;
}>;


export type SubmitAbbreviationMutation = { newAbbreviation: AbbreviationFragment };

export type DeleteAbbreviationMutationVariables = Exact<{
  abbreviation: Scalars['String']['input'];
}>;


export type DeleteAbbreviationMutation = { abbreviation?: { delete: AbbreviationFragment } | null };

export type UpdateAbbreviationMutationVariables = Exact<{
  abbreviation: Scalars['String']['input'];
  abbreviationInput: AbbreviationInput;
}>;


export type UpdateAbbreviationMutation = { abbreviation?: { edit: AbbreviationFragment } | null };

export type ExerciseTextBlockFragment = { id: number, startText: string, ends: Array<string> };

export type ExerciseTextBlockManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type ExerciseTextBlockManagementQuery = { exercises: Array<{ id: number, title: string, textBlocks: Array<ExerciseTextBlockFragment> }> };

export type SubmitExerciseTextBlockMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  textBlock: ExerciseTextBlockInput;
}>;


export type SubmitExerciseTextBlockMutation = { exerciseMutations?: { submitTextBlock: ExerciseTextBlockFragment } | null };

export type UpdateExerciseTextBlockMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  blockId: Scalars['Int']['input'];
  textBlock: ExerciseTextBlockInput;
}>;


export type UpdateExerciseTextBlockMutation = { exerciseMutations?: { textBlock?: { update: ExerciseTextBlockFragment } | null } | null };

export type DeleteExerciseTextBlockMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  blockId: Scalars['Int']['input'];
}>;


export type DeleteExerciseTextBlockMutation = { exerciseMutations?: { textBlock?: { delete: { __typename: 'ExerciseTextBlock' } } | null } | null };

export type SwapBlockMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  blockId: Scalars['Int']['input'];
  secondBlockId: Scalars['Int']['input'];
}>;


export type SwapBlockMutation = { exerciseMutations?: { textBlock?: { swap: { __typename: 'ExerciseTextBlock' } } | null } | null };

type ParagraphSynonymIdentifier_ParagraphSynonym_Fragment = { paragraphType: string, paragraph: string, section: string, lawCode: string };

type ParagraphSynonymIdentifier_ParagraphSynonymIdentifier_Fragment = { paragraphType: string, paragraph: string, section: string, lawCode: string };

export type ParagraphSynonymIdentifierFragment = ParagraphSynonymIdentifier_ParagraphSynonym_Fragment | ParagraphSynonymIdentifier_ParagraphSynonymIdentifier_Fragment;

export type ParagraphSynonymFragment = (
  { sentenceNumber?: string | null, synonym: string }
  & ParagraphSynonymIdentifier_ParagraphSynonym_Fragment
);

export type ParagraphSynonymManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type ParagraphSynonymManagementQuery = { paragraphSynonyms: Array<ParagraphSynonymFragment> };

export type CreateParagraphSynonymMutationVariables = Exact<{
  paragraphSynonymInput: ParagraphSynonymInput;
}>;


export type CreateParagraphSynonymMutation = { createParagraphSynonym: ParagraphSynonymFragment };

export type UpdateParagraphSynonymMutationVariables = Exact<{
  paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput;
  maybeSentenceNumber?: InputMaybe<Scalars['String']['input']>;
  synonym: Scalars['String']['input'];
}>;


export type UpdateParagraphSynonymMutation = { updateParagraphSynonym: ParagraphSynonymFragment };

export type DeleteParagraphSynonymMutationVariables = Exact<{
  paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput;
}>;


export type DeleteParagraphSynonymMutation = { deleteParagraphSynonym: ParagraphSynonymIdentifier_ParagraphSynonymIdentifier_Fragment };

export type RelatedWordFragment = { word: string, isPositive: boolean };

export type RelatedWordsGroupFragment = { groupId: number, content: Array<RelatedWordFragment> };

export type ManageRelatedWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type ManageRelatedWordsQuery = { relatedWordGroups: Array<RelatedWordsGroupFragment> };

export type CreateEmptyRelatedWordsGroupMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEmptyRelatedWordsGroupMutation = { groupId: number };

export type DeleteRelatedWordsGroupMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type DeleteRelatedWordsGroupMutation = { relatedWordsGroup?: { delete: boolean } | null };

export type SubmitRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  relatedWordInput: RelatedWordInput;
}>;


export type SubmitRelatedWordMutation = { relatedWordsGroup?: { submitRelatedWord: RelatedWordFragment } | null };

export type EditRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  originalWord: Scalars['String']['input'];
  relatedWordInput: RelatedWordInput;
}>;


export type EditRelatedWordMutation = { relatedWordsGroup?: { relatedWord?: { edit: RelatedWordFragment } | null } | null };

export type DeleteRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  word: Scalars['String']['input'];
}>;


export type DeleteRelatedWordMutation = { relatedWordsGroup?: { relatedWord?: { delete: RelatedWordFragment } | null } | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
}>;


export type RegisterMutation = { register: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: string };

export type ClaimJwtMutationVariables = Exact<{
  ltiUuid: Scalars['String']['input'];
}>;


export type ClaimJwtMutation = { claimJwt?: string | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { changePassword: boolean };

export type UserFragment = { username: string, rights: Rights };

export type UserManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type UserManagementQuery = { users: Array<UserFragment> };

export type ChangeRightsMutationVariables = Exact<{
  username: Scalars['String']['input'];
  newRights: Rights;
}>;


export type ChangeRightsMutation = { newRights: Rights };

export type ParagraphIdentifierFragment = { paragraphType: string, paragraph: string, section: string, lawCode: string };

export type ParagraphCitationFragment = { paragraphType: string, paragraph: string, section?: string | null, sentence?: string | null, number?: string | null, alternative?: string | null, lawCode: string };

export type ParagraphCitationLocationFragment = { from: number, to: number, rest: string, citedParagraphs: Array<ParagraphCitationFragment> };

export type SolutionIdentifierFragment = { exerciseId: number, exerciseTitle: string, correctionFinished?: boolean | null };

export type ExerciseIdentifierFragment = { id: number, title: string };

export type HomeQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeQuery = { exercises: Array<ExerciseIdentifierFragment>, mySolutions: Array<SolutionIdentifierFragment> };

export type CreateExerciseMutationVariables = Exact<{
  exerciseInput: ExerciseInput;
}>;


export type CreateExerciseMutation = { exerciseId: number };

export type ExerciseOverviewFragment = { title: string, text: string, userSolutions: Array<{ username: string, correctionFinished: boolean }> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseOverviewQuery = { exercise?: ExerciseOverviewFragment | null };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseTaskDefinitionQuery = { exercise?: ExerciseTaskDefinitionFragment | null };

export type ExerciseTaskDefinitionFragment = { title: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  userSolution: UserSolutionInput;
}>;


export type SubmitSolutionMutation = { exerciseMutations?: { submitSolution?: { __typename: 'UserSolution' } | null } | null };

export const SolutionNodeFragmentDoc = gql`
    fragment SolutionNode on SolutionNode {
  id
  childIndex
  isSubText
  text
  applicability
  focusIntensity
  parentId
}
    `;
export const SampleSolutionNodeFragmentDoc = gql`
    fragment SampleSolutionNode on SampleSolutionNode {
  ...SolutionNode
  subTexts
}
    ${SolutionNodeFragmentDoc}`;
export const AnnotationFragmentDoc = gql`
    fragment Annotation on Annotation {
  id
  errorType
  importance
  startIndex
  endIndex
  text
}
    `;
export const UserSolutionNodeFragmentDoc = gql`
    fragment UserSolutionNode on UserSolutionNode {
  ...SolutionNode
  annotations {
    ...Annotation
  }
}
    ${SolutionNodeFragmentDoc}
${AnnotationFragmentDoc}`;
export const ParagraphCitationAnnotationFragmentDoc = gql`
    fragment ParagraphCitationAnnotation on ParagraphCitationAnnotation {
  awaitedParagraph
  correctness
  citedParagraph
  explanation
}
    `;
export const ExplanationAnnotationFragmentDoc = gql`
    fragment ExplanationAnnotation on ExplanationAnnotation {
  sampleNodeId
  userNodeId
  text
}
    `;
export const SolutionNodeMatchFragmentDoc = gql`
    fragment SolutionNodeMatch on SolutionNodeMatch {
  sampleNodeId
  userNodeId
  matchStatus
  certainty
  paragraphCitationCorrectness
  explanationCorrectness
  paragraphCitationAnnotations {
    ...ParagraphCitationAnnotation
  }
  explanationAnnotations {
    ...ExplanationAnnotation
  }
}
    ${ParagraphCitationAnnotationFragmentDoc}
${ExplanationAnnotationFragmentDoc}`;
export const CorrectionSummaryFragmentDoc = gql`
    fragment CorrectionSummary on CorrectionSummary {
  comment
  points
}
    `;
export const UserSolutionFragmentDoc = gql`
    fragment UserSolution on UserSolution {
  userSolutionNodes: nodes {
    ...UserSolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
  correctionSummary {
    ...CorrectionSummary
  }
}
    ${UserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}
${CorrectionSummaryFragmentDoc}`;
export const ReviewDataFragmentDoc = gql`
    fragment ReviewData on ReviewData {
  userSolution {
    ...UserSolutionNode
  }
  sampleSolution {
    ...SolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
  comment
  points
}
    ${UserSolutionNodeFragmentDoc}
${SolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}`;
export const AbbreviationFragmentDoc = gql`
    fragment Abbreviation on Abbreviation {
  abbreviation
  word
}
    `;
export const ExerciseTextBlockFragmentDoc = gql`
    fragment ExerciseTextBlock on ExerciseTextBlock {
  id
  startText
  ends
}
    `;
export const ParagraphSynonymIdentifierFragmentDoc = gql`
    fragment ParagraphSynonymIdentifier on IParagraphSynonymIdentifier {
  paragraphType
  paragraph
  section
  lawCode
}
    `;
export const ParagraphSynonymFragmentDoc = gql`
    fragment ParagraphSynonym on ParagraphSynonym {
  ...ParagraphSynonymIdentifier
  sentenceNumber
  synonym
}
    ${ParagraphSynonymIdentifierFragmentDoc}`;
export const RelatedWordFragmentDoc = gql`
    fragment RelatedWord on RelatedWord {
  word
  isPositive
}
    `;
export const RelatedWordsGroupFragmentDoc = gql`
    fragment RelatedWordsGroup on RelatedWordsGroup {
  groupId
  content {
    ...RelatedWord
  }
}
    ${RelatedWordFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  username
  rights
}
    `;
export const ParagraphIdentifierFragmentDoc = gql`
    fragment ParagraphIdentifier on ParagraphSynonymIdentifier {
  paragraphType
  paragraph
  section
  lawCode
}
    `;
export const ParagraphCitationFragmentDoc = gql`
    fragment ParagraphCitation on ParagraphCitation {
  paragraphType
  paragraph
  section
  sentence
  number
  alternative
  lawCode
}
    `;
export const ParagraphCitationLocationFragmentDoc = gql`
    fragment ParagraphCitationLocation on ParagraphCitationLocation {
  from
  to
  citedParagraphs {
    ...ParagraphCitation
  }
  rest
}
    ${ParagraphCitationFragmentDoc}`;
export const SolutionIdentifierFragmentDoc = gql`
    fragment SolutionIdentifier on SolutionIdentifier {
  exerciseId
  exerciseTitle
  correctionFinished
}
    `;
export const ExerciseIdentifierFragmentDoc = gql`
    fragment ExerciseIdentifier on Exercise {
  id
  title
}
    `;
export const ExerciseOverviewFragmentDoc = gql`
    fragment ExerciseOverview on Exercise {
  title
  text
  userSolutions {
    username
    correctionFinished
  }
}
    `;
export const ExerciseTaskDefinitionFragmentDoc = gql`
    fragment ExerciseTaskDefinition on Exercise {
  title
}
    `;
export const SubmitNewMatchDocument = gql`
    mutation SubmitNewMatch($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        submitMatch(sampleSolutionNodeId: $sampleNodeId) {
          ...SolutionNodeMatch
        }
      }
    }
  }
}
    ${SolutionNodeMatchFragmentDoc}`;
export type SubmitNewMatchMutationFn = Apollo.MutationFunction<SubmitNewMatchMutation, SubmitNewMatchMutationVariables>;

/**
 * __useSubmitNewMatchMutation__
 *
 * To run a mutation, you first call `useSubmitNewMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitNewMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitNewMatchMutation, { data, loading, error }] = useSubmitNewMatchMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *   },
 * });
 */
export function useSubmitNewMatchMutation(baseOptions?: Apollo.MutationHookOptions<SubmitNewMatchMutation, SubmitNewMatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitNewMatchMutation, SubmitNewMatchMutationVariables>(SubmitNewMatchDocument, options);
      }
export type SubmitNewMatchMutationHookResult = ReturnType<typeof useSubmitNewMatchMutation>;
export type SubmitNewMatchMutationResult = Apollo.MutationResult<SubmitNewMatchMutation>;
export type SubmitNewMatchMutationOptions = Apollo.BaseMutationOptions<SubmitNewMatchMutation, SubmitNewMatchMutationVariables>;
export const DeleteMatchDocument = gql`
    mutation DeleteMatch($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          delete {
            ...SolutionNodeMatch
          }
        }
      }
    }
  }
}
    ${SolutionNodeMatchFragmentDoc}`;
export type DeleteMatchMutationFn = Apollo.MutationFunction<DeleteMatchMutation, DeleteMatchMutationVariables>;

/**
 * __useDeleteMatchMutation__
 *
 * To run a mutation, you first call `useDeleteMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMatchMutation, { data, loading, error }] = useDeleteMatchMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *   },
 * });
 */
export function useDeleteMatchMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMatchMutation, DeleteMatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMatchMutation, DeleteMatchMutationVariables>(DeleteMatchDocument, options);
      }
export type DeleteMatchMutationHookResult = ReturnType<typeof useDeleteMatchMutation>;
export type DeleteMatchMutationResult = Apollo.MutationResult<DeleteMatchMutation>;
export type DeleteMatchMutationOptions = Apollo.BaseMutationOptions<DeleteMatchMutation, DeleteMatchMutationVariables>;
export const UpdateParagraphCitationCorrectnessDocument = gql`
    mutation UpdateParagraphCitationCorrectness($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $newCorrectness: Correctness!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          newParagraphCitationCorrectness: updateParagraphCitationCorrectness(
            newCorrectness: $newCorrectness
          )
        }
      }
    }
  }
}
    `;
export type UpdateParagraphCitationCorrectnessMutationFn = Apollo.MutationFunction<UpdateParagraphCitationCorrectnessMutation, UpdateParagraphCitationCorrectnessMutationVariables>;

/**
 * __useUpdateParagraphCitationCorrectnessMutation__
 *
 * To run a mutation, you first call `useUpdateParagraphCitationCorrectnessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParagraphCitationCorrectnessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParagraphCitationCorrectnessMutation, { data, loading, error }] = useUpdateParagraphCitationCorrectnessMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      newCorrectness: // value for 'newCorrectness'
 *   },
 * });
 */
export function useUpdateParagraphCitationCorrectnessMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParagraphCitationCorrectnessMutation, UpdateParagraphCitationCorrectnessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateParagraphCitationCorrectnessMutation, UpdateParagraphCitationCorrectnessMutationVariables>(UpdateParagraphCitationCorrectnessDocument, options);
      }
export type UpdateParagraphCitationCorrectnessMutationHookResult = ReturnType<typeof useUpdateParagraphCitationCorrectnessMutation>;
export type UpdateParagraphCitationCorrectnessMutationResult = Apollo.MutationResult<UpdateParagraphCitationCorrectnessMutation>;
export type UpdateParagraphCitationCorrectnessMutationOptions = Apollo.BaseMutationOptions<UpdateParagraphCitationCorrectnessMutation, UpdateParagraphCitationCorrectnessMutationVariables>;
export const CreateParagraphCitationAnnotationDocument = gql`
    mutation CreateParagraphCitationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $paragraphCitationAnnotation: ParagraphCitationAnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          submitParagraphCitationAnnotation(
            paragraphCitationAnnotation: $paragraphCitationAnnotation
          ) {
            ...ParagraphCitationAnnotation
          }
        }
      }
    }
  }
}
    ${ParagraphCitationAnnotationFragmentDoc}`;
export type CreateParagraphCitationAnnotationMutationFn = Apollo.MutationFunction<CreateParagraphCitationAnnotationMutation, CreateParagraphCitationAnnotationMutationVariables>;

/**
 * __useCreateParagraphCitationAnnotationMutation__
 *
 * To run a mutation, you first call `useCreateParagraphCitationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateParagraphCitationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createParagraphCitationAnnotationMutation, { data, loading, error }] = useCreateParagraphCitationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      paragraphCitationAnnotation: // value for 'paragraphCitationAnnotation'
 *   },
 * });
 */
export function useCreateParagraphCitationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<CreateParagraphCitationAnnotationMutation, CreateParagraphCitationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateParagraphCitationAnnotationMutation, CreateParagraphCitationAnnotationMutationVariables>(CreateParagraphCitationAnnotationDocument, options);
      }
export type CreateParagraphCitationAnnotationMutationHookResult = ReturnType<typeof useCreateParagraphCitationAnnotationMutation>;
export type CreateParagraphCitationAnnotationMutationResult = Apollo.MutationResult<CreateParagraphCitationAnnotationMutation>;
export type CreateParagraphCitationAnnotationMutationOptions = Apollo.BaseMutationOptions<CreateParagraphCitationAnnotationMutation, CreateParagraphCitationAnnotationMutationVariables>;
export const GetParagraphCitationAnnotationTextRecommendationsDocument = gql`
    query GetParagraphCitationAnnotationTextRecommendations($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $awaitedParagraph: String!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          paragraphCitationAnnotation(awaitedParagraph: $awaitedParagraph) {
            explanationRecommendations
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetParagraphCitationAnnotationTextRecommendationsQuery__
 *
 * To run a query within a React component, call `useGetParagraphCitationAnnotationTextRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParagraphCitationAnnotationTextRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParagraphCitationAnnotationTextRecommendationsQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      awaitedParagraph: // value for 'awaitedParagraph'
 *   },
 * });
 */
export function useGetParagraphCitationAnnotationTextRecommendationsQuery(baseOptions: Apollo.QueryHookOptions<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables> & ({ variables: GetParagraphCitationAnnotationTextRecommendationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>(GetParagraphCitationAnnotationTextRecommendationsDocument, options);
      }
export function useGetParagraphCitationAnnotationTextRecommendationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>(GetParagraphCitationAnnotationTextRecommendationsDocument, options);
        }
export function useGetParagraphCitationAnnotationTextRecommendationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>(GetParagraphCitationAnnotationTextRecommendationsDocument, options);
        }
export type GetParagraphCitationAnnotationTextRecommendationsQueryHookResult = ReturnType<typeof useGetParagraphCitationAnnotationTextRecommendationsQuery>;
export type GetParagraphCitationAnnotationTextRecommendationsLazyQueryHookResult = ReturnType<typeof useGetParagraphCitationAnnotationTextRecommendationsLazyQuery>;
export type GetParagraphCitationAnnotationTextRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetParagraphCitationAnnotationTextRecommendationsSuspenseQuery>;
export type GetParagraphCitationAnnotationTextRecommendationsQueryResult = Apollo.QueryResult<GetParagraphCitationAnnotationTextRecommendationsQuery, GetParagraphCitationAnnotationTextRecommendationsQueryVariables>;
export const UpdateParagraphCitationAnnotationDocument = gql`
    mutation UpdateParagraphCitationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $awaitedParagraph: String!, $paragraphCitationAnnotation: ParagraphCitationAnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          paragraphCitationAnnotation(awaitedParagraph: $awaitedParagraph) {
            newValues: update(paragraphCitationAnnotation: $paragraphCitationAnnotation) {
              ...ParagraphCitationAnnotation
            }
          }
        }
      }
    }
  }
}
    ${ParagraphCitationAnnotationFragmentDoc}`;
export type UpdateParagraphCitationAnnotationMutationFn = Apollo.MutationFunction<UpdateParagraphCitationAnnotationMutation, UpdateParagraphCitationAnnotationMutationVariables>;

/**
 * __useUpdateParagraphCitationAnnotationMutation__
 *
 * To run a mutation, you first call `useUpdateParagraphCitationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParagraphCitationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParagraphCitationAnnotationMutation, { data, loading, error }] = useUpdateParagraphCitationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      awaitedParagraph: // value for 'awaitedParagraph'
 *      paragraphCitationAnnotation: // value for 'paragraphCitationAnnotation'
 *   },
 * });
 */
export function useUpdateParagraphCitationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParagraphCitationAnnotationMutation, UpdateParagraphCitationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateParagraphCitationAnnotationMutation, UpdateParagraphCitationAnnotationMutationVariables>(UpdateParagraphCitationAnnotationDocument, options);
      }
export type UpdateParagraphCitationAnnotationMutationHookResult = ReturnType<typeof useUpdateParagraphCitationAnnotationMutation>;
export type UpdateParagraphCitationAnnotationMutationResult = Apollo.MutationResult<UpdateParagraphCitationAnnotationMutation>;
export type UpdateParagraphCitationAnnotationMutationOptions = Apollo.BaseMutationOptions<UpdateParagraphCitationAnnotationMutation, UpdateParagraphCitationAnnotationMutationVariables>;
export const DeleteParagraphCitationAnnotationDocument = gql`
    mutation DeleteParagraphCitationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $awaitedParagraph: String!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          paragraphCitationAnnotation(awaitedParagraph: $awaitedParagraph) {
            delete {
              ...ParagraphCitationAnnotation
            }
          }
        }
      }
    }
  }
}
    ${ParagraphCitationAnnotationFragmentDoc}`;
export type DeleteParagraphCitationAnnotationMutationFn = Apollo.MutationFunction<DeleteParagraphCitationAnnotationMutation, DeleteParagraphCitationAnnotationMutationVariables>;

/**
 * __useDeleteParagraphCitationAnnotationMutation__
 *
 * To run a mutation, you first call `useDeleteParagraphCitationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteParagraphCitationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteParagraphCitationAnnotationMutation, { data, loading, error }] = useDeleteParagraphCitationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      awaitedParagraph: // value for 'awaitedParagraph'
 *   },
 * });
 */
export function useDeleteParagraphCitationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteParagraphCitationAnnotationMutation, DeleteParagraphCitationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteParagraphCitationAnnotationMutation, DeleteParagraphCitationAnnotationMutationVariables>(DeleteParagraphCitationAnnotationDocument, options);
      }
export type DeleteParagraphCitationAnnotationMutationHookResult = ReturnType<typeof useDeleteParagraphCitationAnnotationMutation>;
export type DeleteParagraphCitationAnnotationMutationResult = Apollo.MutationResult<DeleteParagraphCitationAnnotationMutation>;
export type DeleteParagraphCitationAnnotationMutationOptions = Apollo.BaseMutationOptions<DeleteParagraphCitationAnnotationMutation, DeleteParagraphCitationAnnotationMutationVariables>;
export const UpdateExplanationCorrectnessDocument = gql`
    mutation UpdateExplanationCorrectness($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $newCorrectness: Correctness!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          newExplanationCorrectness: updateExplanationCorrectness(
            newCorrectness: $newCorrectness
          )
        }
      }
    }
  }
}
    `;
export type UpdateExplanationCorrectnessMutationFn = Apollo.MutationFunction<UpdateExplanationCorrectnessMutation, UpdateExplanationCorrectnessMutationVariables>;

/**
 * __useUpdateExplanationCorrectnessMutation__
 *
 * To run a mutation, you first call `useUpdateExplanationCorrectnessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExplanationCorrectnessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExplanationCorrectnessMutation, { data, loading, error }] = useUpdateExplanationCorrectnessMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      newCorrectness: // value for 'newCorrectness'
 *   },
 * });
 */
export function useUpdateExplanationCorrectnessMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExplanationCorrectnessMutation, UpdateExplanationCorrectnessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExplanationCorrectnessMutation, UpdateExplanationCorrectnessMutationVariables>(UpdateExplanationCorrectnessDocument, options);
      }
export type UpdateExplanationCorrectnessMutationHookResult = ReturnType<typeof useUpdateExplanationCorrectnessMutation>;
export type UpdateExplanationCorrectnessMutationResult = Apollo.MutationResult<UpdateExplanationCorrectnessMutation>;
export type UpdateExplanationCorrectnessMutationOptions = Apollo.BaseMutationOptions<UpdateExplanationCorrectnessMutation, UpdateExplanationCorrectnessMutationVariables>;
export const SubmitExplanationAnnotationDocument = gql`
    mutation SubmitExplanationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $text: String!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          submitExplanationAnnotation(text: $text) {
            ...ExplanationAnnotation
          }
        }
      }
    }
  }
}
    ${ExplanationAnnotationFragmentDoc}`;
export type SubmitExplanationAnnotationMutationFn = Apollo.MutationFunction<SubmitExplanationAnnotationMutation, SubmitExplanationAnnotationMutationVariables>;

/**
 * __useSubmitExplanationAnnotationMutation__
 *
 * To run a mutation, you first call `useSubmitExplanationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitExplanationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitExplanationAnnotationMutation, { data, loading, error }] = useSubmitExplanationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useSubmitExplanationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<SubmitExplanationAnnotationMutation, SubmitExplanationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitExplanationAnnotationMutation, SubmitExplanationAnnotationMutationVariables>(SubmitExplanationAnnotationDocument, options);
      }
export type SubmitExplanationAnnotationMutationHookResult = ReturnType<typeof useSubmitExplanationAnnotationMutation>;
export type SubmitExplanationAnnotationMutationResult = Apollo.MutationResult<SubmitExplanationAnnotationMutation>;
export type SubmitExplanationAnnotationMutationOptions = Apollo.BaseMutationOptions<SubmitExplanationAnnotationMutation, SubmitExplanationAnnotationMutationVariables>;
export const GetExplanationAnnotationTextRecommendationsDocument = gql`
    query GetExplanationAnnotationTextRecommendations($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          explanationAnnotationRecommendations
        }
      }
    }
  }
}
    `;

/**
 * __useGetExplanationAnnotationTextRecommendationsQuery__
 *
 * To run a query within a React component, call `useGetExplanationAnnotationTextRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExplanationAnnotationTextRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExplanationAnnotationTextRecommendationsQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *   },
 * });
 */
export function useGetExplanationAnnotationTextRecommendationsQuery(baseOptions: Apollo.QueryHookOptions<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables> & ({ variables: GetExplanationAnnotationTextRecommendationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>(GetExplanationAnnotationTextRecommendationsDocument, options);
      }
export function useGetExplanationAnnotationTextRecommendationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>(GetExplanationAnnotationTextRecommendationsDocument, options);
        }
export function useGetExplanationAnnotationTextRecommendationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>(GetExplanationAnnotationTextRecommendationsDocument, options);
        }
export type GetExplanationAnnotationTextRecommendationsQueryHookResult = ReturnType<typeof useGetExplanationAnnotationTextRecommendationsQuery>;
export type GetExplanationAnnotationTextRecommendationsLazyQueryHookResult = ReturnType<typeof useGetExplanationAnnotationTextRecommendationsLazyQuery>;
export type GetExplanationAnnotationTextRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetExplanationAnnotationTextRecommendationsSuspenseQuery>;
export type GetExplanationAnnotationTextRecommendationsQueryResult = Apollo.QueryResult<GetExplanationAnnotationTextRecommendationsQuery, GetExplanationAnnotationTextRecommendationsQueryVariables>;
export const UpdateExplanationAnnotationDocument = gql`
    mutation UpdateExplanationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $oldText: String!, $text: String!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          explanationAnnotation(text: $oldText) {
            edit(text: $text)
          }
        }
      }
    }
  }
}
    `;
export type UpdateExplanationAnnotationMutationFn = Apollo.MutationFunction<UpdateExplanationAnnotationMutation, UpdateExplanationAnnotationMutationVariables>;

/**
 * __useUpdateExplanationAnnotationMutation__
 *
 * To run a mutation, you first call `useUpdateExplanationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExplanationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExplanationAnnotationMutation, { data, loading, error }] = useUpdateExplanationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      oldText: // value for 'oldText'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdateExplanationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExplanationAnnotationMutation, UpdateExplanationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExplanationAnnotationMutation, UpdateExplanationAnnotationMutationVariables>(UpdateExplanationAnnotationDocument, options);
      }
export type UpdateExplanationAnnotationMutationHookResult = ReturnType<typeof useUpdateExplanationAnnotationMutation>;
export type UpdateExplanationAnnotationMutationResult = Apollo.MutationResult<UpdateExplanationAnnotationMutation>;
export type UpdateExplanationAnnotationMutationOptions = Apollo.BaseMutationOptions<UpdateExplanationAnnotationMutation, UpdateExplanationAnnotationMutationVariables>;
export const DeleteExplanationAnnotationDocument = gql`
    mutation DeleteExplanationAnnotation($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!, $text: String!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        match(sampleSolutionNodeId: $sampleNodeId) {
          explanationAnnotation(text: $text) {
            delete {
              ...ExplanationAnnotation
            }
          }
        }
      }
    }
  }
}
    ${ExplanationAnnotationFragmentDoc}`;
export type DeleteExplanationAnnotationMutationFn = Apollo.MutationFunction<DeleteExplanationAnnotationMutation, DeleteExplanationAnnotationMutationVariables>;

/**
 * __useDeleteExplanationAnnotationMutation__
 *
 * To run a mutation, you first call `useDeleteExplanationAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExplanationAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExplanationAnnotationMutation, { data, loading, error }] = useDeleteExplanationAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useDeleteExplanationAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExplanationAnnotationMutation, DeleteExplanationAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExplanationAnnotationMutation, DeleteExplanationAnnotationMutationVariables>(DeleteExplanationAnnotationDocument, options);
      }
export type DeleteExplanationAnnotationMutationHookResult = ReturnType<typeof useDeleteExplanationAnnotationMutation>;
export type DeleteExplanationAnnotationMutationResult = Apollo.MutationResult<DeleteExplanationAnnotationMutation>;
export type DeleteExplanationAnnotationMutationOptions = Apollo.BaseMutationOptions<DeleteExplanationAnnotationMutation, DeleteExplanationAnnotationMutationVariables>;
export const SubmitAnnotationDocument = gql`
    mutation SubmitAnnotation($exerciseId: Int!, $username: String!, $nodeId: Int!, $annotationInput: AnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $nodeId) {
        submitAnnotation(annotation: $annotationInput) {
          ...Annotation
        }
      }
    }
  }
}
    ${AnnotationFragmentDoc}`;
export type SubmitAnnotationMutationFn = Apollo.MutationFunction<SubmitAnnotationMutation, SubmitAnnotationMutationVariables>;

/**
 * __useSubmitAnnotationMutation__
 *
 * To run a mutation, you first call `useSubmitAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitAnnotationMutation, { data, loading, error }] = useSubmitAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      nodeId: // value for 'nodeId'
 *      annotationInput: // value for 'annotationInput'
 *   },
 * });
 */
export function useSubmitAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<SubmitAnnotationMutation, SubmitAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitAnnotationMutation, SubmitAnnotationMutationVariables>(SubmitAnnotationDocument, options);
      }
export type SubmitAnnotationMutationHookResult = ReturnType<typeof useSubmitAnnotationMutation>;
export type SubmitAnnotationMutationResult = Apollo.MutationResult<SubmitAnnotationMutation>;
export type SubmitAnnotationMutationOptions = Apollo.BaseMutationOptions<SubmitAnnotationMutation, SubmitAnnotationMutationVariables>;
export const UpdateAnnotationDocument = gql`
    mutation UpdateAnnotation($exerciseId: Int!, $username: String!, $nodeId: Int!, $annotationId: Int!, $annotationInput: AnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $nodeId) {
        annotation(annotationId: $annotationId) {
          update(annotation: $annotationInput) {
            ...Annotation
          }
        }
      }
    }
  }
}
    ${AnnotationFragmentDoc}`;
export type UpdateAnnotationMutationFn = Apollo.MutationFunction<UpdateAnnotationMutation, UpdateAnnotationMutationVariables>;

/**
 * __useUpdateAnnotationMutation__
 *
 * To run a mutation, you first call `useUpdateAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAnnotationMutation, { data, loading, error }] = useUpdateAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      nodeId: // value for 'nodeId'
 *      annotationId: // value for 'annotationId'
 *      annotationInput: // value for 'annotationInput'
 *   },
 * });
 */
export function useUpdateAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAnnotationMutation, UpdateAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAnnotationMutation, UpdateAnnotationMutationVariables>(UpdateAnnotationDocument, options);
      }
export type UpdateAnnotationMutationHookResult = ReturnType<typeof useUpdateAnnotationMutation>;
export type UpdateAnnotationMutationResult = Apollo.MutationResult<UpdateAnnotationMutation>;
export type UpdateAnnotationMutationOptions = Apollo.BaseMutationOptions<UpdateAnnotationMutation, UpdateAnnotationMutationVariables>;
export const DeleteAnnotationDocument = gql`
    mutation DeleteAnnotation($exerciseId: Int!, $username: String!, $userSolutionNodeId: Int!, $annotationId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userSolutionNodeId) {
        annotation(annotationId: $annotationId) {
          delete
        }
      }
    }
  }
}
    `;
export type DeleteAnnotationMutationFn = Apollo.MutationFunction<DeleteAnnotationMutation, DeleteAnnotationMutationVariables>;

/**
 * __useDeleteAnnotationMutation__
 *
 * To run a mutation, you first call `useDeleteAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAnnotationMutation, { data, loading, error }] = useDeleteAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      userSolutionNodeId: // value for 'userSolutionNodeId'
 *      annotationId: // value for 'annotationId'
 *   },
 * });
 */
export function useDeleteAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAnnotationMutation, DeleteAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAnnotationMutation, DeleteAnnotationMutationVariables>(DeleteAnnotationDocument, options);
      }
export type DeleteAnnotationMutationHookResult = ReturnType<typeof useDeleteAnnotationMutation>;
export type DeleteAnnotationMutationResult = Apollo.MutationResult<DeleteAnnotationMutation>;
export type DeleteAnnotationMutationOptions = Apollo.BaseMutationOptions<DeleteAnnotationMutation, DeleteAnnotationMutationVariables>;
export const UpsertCorrectionSummaryDocument = gql`
    mutation UpsertCorrectionSummary($exerciseId: Int!, $username: String!, $comment: String!, $points: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      updateCorrectionResult(comment: $comment, points: $points) {
        ...CorrectionSummary
      }
    }
  }
}
    ${CorrectionSummaryFragmentDoc}`;
export type UpsertCorrectionSummaryMutationFn = Apollo.MutationFunction<UpsertCorrectionSummaryMutation, UpsertCorrectionSummaryMutationVariables>;

/**
 * __useUpsertCorrectionSummaryMutation__
 *
 * To run a mutation, you first call `useUpsertCorrectionSummaryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCorrectionSummaryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCorrectionSummaryMutation, { data, loading, error }] = useUpsertCorrectionSummaryMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      comment: // value for 'comment'
 *      points: // value for 'points'
 *   },
 * });
 */
export function useUpsertCorrectionSummaryMutation(baseOptions?: Apollo.MutationHookOptions<UpsertCorrectionSummaryMutation, UpsertCorrectionSummaryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertCorrectionSummaryMutation, UpsertCorrectionSummaryMutationVariables>(UpsertCorrectionSummaryDocument, options);
      }
export type UpsertCorrectionSummaryMutationHookResult = ReturnType<typeof useUpsertCorrectionSummaryMutation>;
export type UpsertCorrectionSummaryMutationResult = Apollo.MutationResult<UpsertCorrectionSummaryMutation>;
export type UpsertCorrectionSummaryMutationOptions = Apollo.BaseMutationOptions<UpsertCorrectionSummaryMutation, UpsertCorrectionSummaryMutationVariables>;
export const FinishCorrectionDocument = gql`
    mutation FinishCorrection($exerciseId: Int!, $username: String!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      finishCorrection
    }
  }
}
    `;
export type FinishCorrectionMutationFn = Apollo.MutationFunction<FinishCorrectionMutation, FinishCorrectionMutationVariables>;

/**
 * __useFinishCorrectionMutation__
 *
 * To run a mutation, you first call `useFinishCorrectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinishCorrectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finishCorrectionMutation, { data, loading, error }] = useFinishCorrectionMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFinishCorrectionMutation(baseOptions?: Apollo.MutationHookOptions<FinishCorrectionMutation, FinishCorrectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FinishCorrectionMutation, FinishCorrectionMutationVariables>(FinishCorrectionDocument, options);
      }
export type FinishCorrectionMutationHookResult = ReturnType<typeof useFinishCorrectionMutation>;
export type FinishCorrectionMutationResult = Apollo.MutationResult<FinishCorrectionMutation>;
export type FinishCorrectionMutationOptions = Apollo.BaseMutationOptions<FinishCorrectionMutation, FinishCorrectionMutationVariables>;
export const CorrectionDocument = gql`
    query Correction($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    sampleSolution {
      ...SampleSolutionNode
    }
    userSolution(username: $username) {
      ...UserSolution
    }
    textBlocks {
      ...ExerciseTextBlock
    }
  }
}
    ${SampleSolutionNodeFragmentDoc}
${UserSolutionFragmentDoc}
${ExerciseTextBlockFragmentDoc}`;

/**
 * __useCorrectionQuery__
 *
 * To run a query within a React component, call `useCorrectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCorrectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCorrectionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCorrectionQuery(baseOptions: Apollo.QueryHookOptions<CorrectionQuery, CorrectionQueryVariables> & ({ variables: CorrectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectionQuery, CorrectionQueryVariables>(CorrectionDocument, options);
      }
export function useCorrectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectionQuery, CorrectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectionQuery, CorrectionQueryVariables>(CorrectionDocument, options);
        }
export function useCorrectionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CorrectionQuery, CorrectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CorrectionQuery, CorrectionQueryVariables>(CorrectionDocument, options);
        }
export type CorrectionQueryHookResult = ReturnType<typeof useCorrectionQuery>;
export type CorrectionLazyQueryHookResult = ReturnType<typeof useCorrectionLazyQuery>;
export type CorrectionSuspenseQueryHookResult = ReturnType<typeof useCorrectionSuspenseQuery>;
export type CorrectionQueryResult = Apollo.QueryResult<CorrectionQuery, CorrectionQueryVariables>;
export const BatchUplExerciseDocument = gql`
    query BatchUplExercise($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    title
    text
  }
}
    `;

/**
 * __useBatchUplExerciseQuery__
 *
 * To run a query within a React component, call `useBatchUplExerciseQuery` and pass it any options that fit your needs.
 * When your component renders, `useBatchUplExerciseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBatchUplExerciseQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useBatchUplExerciseQuery(baseOptions: Apollo.QueryHookOptions<BatchUplExerciseQuery, BatchUplExerciseQueryVariables> & ({ variables: BatchUplExerciseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>(BatchUplExerciseDocument, options);
      }
export function useBatchUplExerciseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>(BatchUplExerciseDocument, options);
        }
export function useBatchUplExerciseSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>(BatchUplExerciseDocument, options);
        }
export type BatchUplExerciseQueryHookResult = ReturnType<typeof useBatchUplExerciseQuery>;
export type BatchUplExerciseLazyQueryHookResult = ReturnType<typeof useBatchUplExerciseLazyQuery>;
export type BatchUplExerciseSuspenseQueryHookResult = ReturnType<typeof useBatchUplExerciseSuspenseQuery>;
export type BatchUplExerciseQueryResult = Apollo.QueryResult<BatchUplExerciseQuery, BatchUplExerciseQueryVariables>;
export const CorrectionReviewDocument = gql`
    query CorrectionReview($exerciseId: Int!) {
  reviewCorrection(exerciseId: $exerciseId) {
    ...ReviewData
  }
}
    ${ReviewDataFragmentDoc}`;

/**
 * __useCorrectionReviewQuery__
 *
 * To run a query within a React component, call `useCorrectionReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useCorrectionReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCorrectionReviewQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useCorrectionReviewQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables> & ({ variables: CorrectionReviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectionReviewQuery, CorrectionReviewQueryVariables>(CorrectionReviewDocument, options);
      }
export function useCorrectionReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectionReviewQuery, CorrectionReviewQueryVariables>(CorrectionReviewDocument, options);
        }
export function useCorrectionReviewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CorrectionReviewQuery, CorrectionReviewQueryVariables>(CorrectionReviewDocument, options);
        }
export type CorrectionReviewQueryHookResult = ReturnType<typeof useCorrectionReviewQuery>;
export type CorrectionReviewLazyQueryHookResult = ReturnType<typeof useCorrectionReviewLazyQuery>;
export type CorrectionReviewSuspenseQueryHookResult = ReturnType<typeof useCorrectionReviewSuspenseQuery>;
export type CorrectionReviewQueryResult = Apollo.QueryResult<CorrectionReviewQuery, CorrectionReviewQueryVariables>;
export const CorrectionReviewByUuidDocument = gql`
    query CorrectionReviewByUuid($uuid: String!) {
  reviewCorrectionByUuid(uuid: $uuid) {
    ...ReviewData
  }
}
    ${ReviewDataFragmentDoc}`;

/**
 * __useCorrectionReviewByUuidQuery__
 *
 * To run a query within a React component, call `useCorrectionReviewByUuidQuery` and pass it any options that fit your needs.
 * When your component renders, `useCorrectionReviewByUuidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCorrectionReviewByUuidQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useCorrectionReviewByUuidQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables> & ({ variables: CorrectionReviewByUuidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>(CorrectionReviewByUuidDocument, options);
      }
export function useCorrectionReviewByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>(CorrectionReviewByUuidDocument, options);
        }
export function useCorrectionReviewByUuidSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>(CorrectionReviewByUuidDocument, options);
        }
export type CorrectionReviewByUuidQueryHookResult = ReturnType<typeof useCorrectionReviewByUuidQuery>;
export type CorrectionReviewByUuidLazyQueryHookResult = ReturnType<typeof useCorrectionReviewByUuidLazyQuery>;
export type CorrectionReviewByUuidSuspenseQueryHookResult = ReturnType<typeof useCorrectionReviewByUuidSuspenseQuery>;
export type CorrectionReviewByUuidQueryResult = Apollo.QueryResult<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>;
export const AbbreviationManagementDocument = gql`
    query AbbreviationManagement {
  abbreviations {
    ...Abbreviation
  }
}
    ${AbbreviationFragmentDoc}`;

/**
 * __useAbbreviationManagementQuery__
 *
 * To run a query within a React component, call `useAbbreviationManagementQuery` and pass it any options that fit your needs.
 * When your component renders, `useAbbreviationManagementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAbbreviationManagementQuery({
 *   variables: {
 *   },
 * });
 */
export function useAbbreviationManagementQuery(baseOptions?: Apollo.QueryHookOptions<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>(AbbreviationManagementDocument, options);
      }
export function useAbbreviationManagementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>(AbbreviationManagementDocument, options);
        }
export function useAbbreviationManagementSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>(AbbreviationManagementDocument, options);
        }
export type AbbreviationManagementQueryHookResult = ReturnType<typeof useAbbreviationManagementQuery>;
export type AbbreviationManagementLazyQueryHookResult = ReturnType<typeof useAbbreviationManagementLazyQuery>;
export type AbbreviationManagementSuspenseQueryHookResult = ReturnType<typeof useAbbreviationManagementSuspenseQuery>;
export type AbbreviationManagementQueryResult = Apollo.QueryResult<AbbreviationManagementQuery, AbbreviationManagementQueryVariables>;
export const SubmitAbbreviationDocument = gql`
    mutation SubmitAbbreviation($abbreviationInput: AbbreviationInput!) {
  newAbbreviation: submitNewAbbreviation(abbreviationInput: $abbreviationInput) {
    ...Abbreviation
  }
}
    ${AbbreviationFragmentDoc}`;
export type SubmitAbbreviationMutationFn = Apollo.MutationFunction<SubmitAbbreviationMutation, SubmitAbbreviationMutationVariables>;

/**
 * __useSubmitAbbreviationMutation__
 *
 * To run a mutation, you first call `useSubmitAbbreviationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitAbbreviationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitAbbreviationMutation, { data, loading, error }] = useSubmitAbbreviationMutation({
 *   variables: {
 *      abbreviationInput: // value for 'abbreviationInput'
 *   },
 * });
 */
export function useSubmitAbbreviationMutation(baseOptions?: Apollo.MutationHookOptions<SubmitAbbreviationMutation, SubmitAbbreviationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitAbbreviationMutation, SubmitAbbreviationMutationVariables>(SubmitAbbreviationDocument, options);
      }
export type SubmitAbbreviationMutationHookResult = ReturnType<typeof useSubmitAbbreviationMutation>;
export type SubmitAbbreviationMutationResult = Apollo.MutationResult<SubmitAbbreviationMutation>;
export type SubmitAbbreviationMutationOptions = Apollo.BaseMutationOptions<SubmitAbbreviationMutation, SubmitAbbreviationMutationVariables>;
export const DeleteAbbreviationDocument = gql`
    mutation DeleteAbbreviation($abbreviation: String!) {
  abbreviation(abbreviation: $abbreviation) {
    delete {
      ...Abbreviation
    }
  }
}
    ${AbbreviationFragmentDoc}`;
export type DeleteAbbreviationMutationFn = Apollo.MutationFunction<DeleteAbbreviationMutation, DeleteAbbreviationMutationVariables>;

/**
 * __useDeleteAbbreviationMutation__
 *
 * To run a mutation, you first call `useDeleteAbbreviationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAbbreviationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAbbreviationMutation, { data, loading, error }] = useDeleteAbbreviationMutation({
 *   variables: {
 *      abbreviation: // value for 'abbreviation'
 *   },
 * });
 */
export function useDeleteAbbreviationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAbbreviationMutation, DeleteAbbreviationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAbbreviationMutation, DeleteAbbreviationMutationVariables>(DeleteAbbreviationDocument, options);
      }
export type DeleteAbbreviationMutationHookResult = ReturnType<typeof useDeleteAbbreviationMutation>;
export type DeleteAbbreviationMutationResult = Apollo.MutationResult<DeleteAbbreviationMutation>;
export type DeleteAbbreviationMutationOptions = Apollo.BaseMutationOptions<DeleteAbbreviationMutation, DeleteAbbreviationMutationVariables>;
export const UpdateAbbreviationDocument = gql`
    mutation UpdateAbbreviation($abbreviation: String!, $abbreviationInput: AbbreviationInput!) {
  abbreviation(abbreviation: $abbreviation) {
    edit(abbreviationInput: $abbreviationInput) {
      ...Abbreviation
    }
  }
}
    ${AbbreviationFragmentDoc}`;
export type UpdateAbbreviationMutationFn = Apollo.MutationFunction<UpdateAbbreviationMutation, UpdateAbbreviationMutationVariables>;

/**
 * __useUpdateAbbreviationMutation__
 *
 * To run a mutation, you first call `useUpdateAbbreviationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAbbreviationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAbbreviationMutation, { data, loading, error }] = useUpdateAbbreviationMutation({
 *   variables: {
 *      abbreviation: // value for 'abbreviation'
 *      abbreviationInput: // value for 'abbreviationInput'
 *   },
 * });
 */
export function useUpdateAbbreviationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAbbreviationMutation, UpdateAbbreviationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAbbreviationMutation, UpdateAbbreviationMutationVariables>(UpdateAbbreviationDocument, options);
      }
export type UpdateAbbreviationMutationHookResult = ReturnType<typeof useUpdateAbbreviationMutation>;
export type UpdateAbbreviationMutationResult = Apollo.MutationResult<UpdateAbbreviationMutation>;
export type UpdateAbbreviationMutationOptions = Apollo.BaseMutationOptions<UpdateAbbreviationMutation, UpdateAbbreviationMutationVariables>;
export const ExerciseTextBlockManagementDocument = gql`
    query ExerciseTextBlockManagement {
  exercises {
    id
    title
    textBlocks {
      ...ExerciseTextBlock
    }
  }
}
    ${ExerciseTextBlockFragmentDoc}`;

/**
 * __useExerciseTextBlockManagementQuery__
 *
 * To run a query within a React component, call `useExerciseTextBlockManagementQuery` and pass it any options that fit your needs.
 * When your component renders, `useExerciseTextBlockManagementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExerciseTextBlockManagementQuery({
 *   variables: {
 *   },
 * });
 */
export function useExerciseTextBlockManagementQuery(baseOptions?: Apollo.QueryHookOptions<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>(ExerciseTextBlockManagementDocument, options);
      }
export function useExerciseTextBlockManagementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>(ExerciseTextBlockManagementDocument, options);
        }
export function useExerciseTextBlockManagementSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>(ExerciseTextBlockManagementDocument, options);
        }
export type ExerciseTextBlockManagementQueryHookResult = ReturnType<typeof useExerciseTextBlockManagementQuery>;
export type ExerciseTextBlockManagementLazyQueryHookResult = ReturnType<typeof useExerciseTextBlockManagementLazyQuery>;
export type ExerciseTextBlockManagementSuspenseQueryHookResult = ReturnType<typeof useExerciseTextBlockManagementSuspenseQuery>;
export type ExerciseTextBlockManagementQueryResult = Apollo.QueryResult<ExerciseTextBlockManagementQuery, ExerciseTextBlockManagementQueryVariables>;
export const SubmitExerciseTextBlockDocument = gql`
    mutation SubmitExerciseTextBlock($exerciseId: Int!, $textBlock: ExerciseTextBlockInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitTextBlock(textBlock: $textBlock) {
      ...ExerciseTextBlock
    }
  }
}
    ${ExerciseTextBlockFragmentDoc}`;
export type SubmitExerciseTextBlockMutationFn = Apollo.MutationFunction<SubmitExerciseTextBlockMutation, SubmitExerciseTextBlockMutationVariables>;

/**
 * __useSubmitExerciseTextBlockMutation__
 *
 * To run a mutation, you first call `useSubmitExerciseTextBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitExerciseTextBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitExerciseTextBlockMutation, { data, loading, error }] = useSubmitExerciseTextBlockMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      textBlock: // value for 'textBlock'
 *   },
 * });
 */
export function useSubmitExerciseTextBlockMutation(baseOptions?: Apollo.MutationHookOptions<SubmitExerciseTextBlockMutation, SubmitExerciseTextBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitExerciseTextBlockMutation, SubmitExerciseTextBlockMutationVariables>(SubmitExerciseTextBlockDocument, options);
      }
export type SubmitExerciseTextBlockMutationHookResult = ReturnType<typeof useSubmitExerciseTextBlockMutation>;
export type SubmitExerciseTextBlockMutationResult = Apollo.MutationResult<SubmitExerciseTextBlockMutation>;
export type SubmitExerciseTextBlockMutationOptions = Apollo.BaseMutationOptions<SubmitExerciseTextBlockMutation, SubmitExerciseTextBlockMutationVariables>;
export const UpdateExerciseTextBlockDocument = gql`
    mutation UpdateExerciseTextBlock($exerciseId: Int!, $blockId: Int!, $textBlock: ExerciseTextBlockInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    textBlock(blockId: $blockId) {
      update(textBlock: $textBlock) {
        ...ExerciseTextBlock
      }
    }
  }
}
    ${ExerciseTextBlockFragmentDoc}`;
export type UpdateExerciseTextBlockMutationFn = Apollo.MutationFunction<UpdateExerciseTextBlockMutation, UpdateExerciseTextBlockMutationVariables>;

/**
 * __useUpdateExerciseTextBlockMutation__
 *
 * To run a mutation, you first call `useUpdateExerciseTextBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExerciseTextBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExerciseTextBlockMutation, { data, loading, error }] = useUpdateExerciseTextBlockMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      blockId: // value for 'blockId'
 *      textBlock: // value for 'textBlock'
 *   },
 * });
 */
export function useUpdateExerciseTextBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExerciseTextBlockMutation, UpdateExerciseTextBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExerciseTextBlockMutation, UpdateExerciseTextBlockMutationVariables>(UpdateExerciseTextBlockDocument, options);
      }
export type UpdateExerciseTextBlockMutationHookResult = ReturnType<typeof useUpdateExerciseTextBlockMutation>;
export type UpdateExerciseTextBlockMutationResult = Apollo.MutationResult<UpdateExerciseTextBlockMutation>;
export type UpdateExerciseTextBlockMutationOptions = Apollo.BaseMutationOptions<UpdateExerciseTextBlockMutation, UpdateExerciseTextBlockMutationVariables>;
export const DeleteExerciseTextBlockDocument = gql`
    mutation DeleteExerciseTextBlock($exerciseId: Int!, $blockId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    textBlock(blockId: $blockId) {
      delete {
        __typename
      }
    }
  }
}
    `;
export type DeleteExerciseTextBlockMutationFn = Apollo.MutationFunction<DeleteExerciseTextBlockMutation, DeleteExerciseTextBlockMutationVariables>;

/**
 * __useDeleteExerciseTextBlockMutation__
 *
 * To run a mutation, you first call `useDeleteExerciseTextBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExerciseTextBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExerciseTextBlockMutation, { data, loading, error }] = useDeleteExerciseTextBlockMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      blockId: // value for 'blockId'
 *   },
 * });
 */
export function useDeleteExerciseTextBlockMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExerciseTextBlockMutation, DeleteExerciseTextBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExerciseTextBlockMutation, DeleteExerciseTextBlockMutationVariables>(DeleteExerciseTextBlockDocument, options);
      }
export type DeleteExerciseTextBlockMutationHookResult = ReturnType<typeof useDeleteExerciseTextBlockMutation>;
export type DeleteExerciseTextBlockMutationResult = Apollo.MutationResult<DeleteExerciseTextBlockMutation>;
export type DeleteExerciseTextBlockMutationOptions = Apollo.BaseMutationOptions<DeleteExerciseTextBlockMutation, DeleteExerciseTextBlockMutationVariables>;
export const SwapBlockDocument = gql`
    mutation SwapBlock($exerciseId: Int!, $blockId: Int!, $secondBlockId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    textBlock(blockId: $blockId) {
      swap(secondBlockId: $secondBlockId) {
        __typename
      }
    }
  }
}
    `;
export type SwapBlockMutationFn = Apollo.MutationFunction<SwapBlockMutation, SwapBlockMutationVariables>;

/**
 * __useSwapBlockMutation__
 *
 * To run a mutation, you first call `useSwapBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSwapBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [swapBlockMutation, { data, loading, error }] = useSwapBlockMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      blockId: // value for 'blockId'
 *      secondBlockId: // value for 'secondBlockId'
 *   },
 * });
 */
export function useSwapBlockMutation(baseOptions?: Apollo.MutationHookOptions<SwapBlockMutation, SwapBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SwapBlockMutation, SwapBlockMutationVariables>(SwapBlockDocument, options);
      }
export type SwapBlockMutationHookResult = ReturnType<typeof useSwapBlockMutation>;
export type SwapBlockMutationResult = Apollo.MutationResult<SwapBlockMutation>;
export type SwapBlockMutationOptions = Apollo.BaseMutationOptions<SwapBlockMutation, SwapBlockMutationVariables>;
export const ParagraphSynonymManagementDocument = gql`
    query ParagraphSynonymManagement {
  paragraphSynonyms {
    ...ParagraphSynonym
  }
}
    ${ParagraphSynonymFragmentDoc}`;

/**
 * __useParagraphSynonymManagementQuery__
 *
 * To run a query within a React component, call `useParagraphSynonymManagementQuery` and pass it any options that fit your needs.
 * When your component renders, `useParagraphSynonymManagementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParagraphSynonymManagementQuery({
 *   variables: {
 *   },
 * });
 */
export function useParagraphSynonymManagementQuery(baseOptions?: Apollo.QueryHookOptions<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>(ParagraphSynonymManagementDocument, options);
      }
export function useParagraphSynonymManagementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>(ParagraphSynonymManagementDocument, options);
        }
export function useParagraphSynonymManagementSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>(ParagraphSynonymManagementDocument, options);
        }
export type ParagraphSynonymManagementQueryHookResult = ReturnType<typeof useParagraphSynonymManagementQuery>;
export type ParagraphSynonymManagementLazyQueryHookResult = ReturnType<typeof useParagraphSynonymManagementLazyQuery>;
export type ParagraphSynonymManagementSuspenseQueryHookResult = ReturnType<typeof useParagraphSynonymManagementSuspenseQuery>;
export type ParagraphSynonymManagementQueryResult = Apollo.QueryResult<ParagraphSynonymManagementQuery, ParagraphSynonymManagementQueryVariables>;
export const CreateParagraphSynonymDocument = gql`
    mutation CreateParagraphSynonym($paragraphSynonymInput: ParagraphSynonymInput!) {
  createParagraphSynonym(paragraphSynonymInput: $paragraphSynonymInput) {
    ...ParagraphSynonym
  }
}
    ${ParagraphSynonymFragmentDoc}`;
export type CreateParagraphSynonymMutationFn = Apollo.MutationFunction<CreateParagraphSynonymMutation, CreateParagraphSynonymMutationVariables>;

/**
 * __useCreateParagraphSynonymMutation__
 *
 * To run a mutation, you first call `useCreateParagraphSynonymMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateParagraphSynonymMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createParagraphSynonymMutation, { data, loading, error }] = useCreateParagraphSynonymMutation({
 *   variables: {
 *      paragraphSynonymInput: // value for 'paragraphSynonymInput'
 *   },
 * });
 */
export function useCreateParagraphSynonymMutation(baseOptions?: Apollo.MutationHookOptions<CreateParagraphSynonymMutation, CreateParagraphSynonymMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateParagraphSynonymMutation, CreateParagraphSynonymMutationVariables>(CreateParagraphSynonymDocument, options);
      }
export type CreateParagraphSynonymMutationHookResult = ReturnType<typeof useCreateParagraphSynonymMutation>;
export type CreateParagraphSynonymMutationResult = Apollo.MutationResult<CreateParagraphSynonymMutation>;
export type CreateParagraphSynonymMutationOptions = Apollo.BaseMutationOptions<CreateParagraphSynonymMutation, CreateParagraphSynonymMutationVariables>;
export const UpdateParagraphSynonymDocument = gql`
    mutation UpdateParagraphSynonym($paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput!, $maybeSentenceNumber: String, $synonym: String!) {
  updateParagraphSynonym(
    paragraphSynonymIdentifierInput: $paragraphSynonymIdentifierInput
    maybeSentenceNumber: $maybeSentenceNumber
    synonym: $synonym
  ) {
    ...ParagraphSynonym
  }
}
    ${ParagraphSynonymFragmentDoc}`;
export type UpdateParagraphSynonymMutationFn = Apollo.MutationFunction<UpdateParagraphSynonymMutation, UpdateParagraphSynonymMutationVariables>;

/**
 * __useUpdateParagraphSynonymMutation__
 *
 * To run a mutation, you first call `useUpdateParagraphSynonymMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParagraphSynonymMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParagraphSynonymMutation, { data, loading, error }] = useUpdateParagraphSynonymMutation({
 *   variables: {
 *      paragraphSynonymIdentifierInput: // value for 'paragraphSynonymIdentifierInput'
 *      maybeSentenceNumber: // value for 'maybeSentenceNumber'
 *      synonym: // value for 'synonym'
 *   },
 * });
 */
export function useUpdateParagraphSynonymMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParagraphSynonymMutation, UpdateParagraphSynonymMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateParagraphSynonymMutation, UpdateParagraphSynonymMutationVariables>(UpdateParagraphSynonymDocument, options);
      }
export type UpdateParagraphSynonymMutationHookResult = ReturnType<typeof useUpdateParagraphSynonymMutation>;
export type UpdateParagraphSynonymMutationResult = Apollo.MutationResult<UpdateParagraphSynonymMutation>;
export type UpdateParagraphSynonymMutationOptions = Apollo.BaseMutationOptions<UpdateParagraphSynonymMutation, UpdateParagraphSynonymMutationVariables>;
export const DeleteParagraphSynonymDocument = gql`
    mutation DeleteParagraphSynonym($paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput!) {
  deleteParagraphSynonym(
    paragraphSynonymIdentifierInput: $paragraphSynonymIdentifierInput
  ) {
    ...ParagraphSynonymIdentifier
  }
}
    ${ParagraphSynonymIdentifierFragmentDoc}`;
export type DeleteParagraphSynonymMutationFn = Apollo.MutationFunction<DeleteParagraphSynonymMutation, DeleteParagraphSynonymMutationVariables>;

/**
 * __useDeleteParagraphSynonymMutation__
 *
 * To run a mutation, you first call `useDeleteParagraphSynonymMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteParagraphSynonymMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteParagraphSynonymMutation, { data, loading, error }] = useDeleteParagraphSynonymMutation({
 *   variables: {
 *      paragraphSynonymIdentifierInput: // value for 'paragraphSynonymIdentifierInput'
 *   },
 * });
 */
export function useDeleteParagraphSynonymMutation(baseOptions?: Apollo.MutationHookOptions<DeleteParagraphSynonymMutation, DeleteParagraphSynonymMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteParagraphSynonymMutation, DeleteParagraphSynonymMutationVariables>(DeleteParagraphSynonymDocument, options);
      }
export type DeleteParagraphSynonymMutationHookResult = ReturnType<typeof useDeleteParagraphSynonymMutation>;
export type DeleteParagraphSynonymMutationResult = Apollo.MutationResult<DeleteParagraphSynonymMutation>;
export type DeleteParagraphSynonymMutationOptions = Apollo.BaseMutationOptions<DeleteParagraphSynonymMutation, DeleteParagraphSynonymMutationVariables>;
export const ManageRelatedWordsDocument = gql`
    query ManageRelatedWords {
  relatedWordGroups {
    ...RelatedWordsGroup
  }
}
    ${RelatedWordsGroupFragmentDoc}`;

/**
 * __useManageRelatedWordsQuery__
 *
 * To run a query within a React component, call `useManageRelatedWordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useManageRelatedWordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManageRelatedWordsQuery({
 *   variables: {
 *   },
 * });
 */
export function useManageRelatedWordsQuery(baseOptions?: Apollo.QueryHookOptions<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>(ManageRelatedWordsDocument, options);
      }
export function useManageRelatedWordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>(ManageRelatedWordsDocument, options);
        }
export function useManageRelatedWordsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>(ManageRelatedWordsDocument, options);
        }
export type ManageRelatedWordsQueryHookResult = ReturnType<typeof useManageRelatedWordsQuery>;
export type ManageRelatedWordsLazyQueryHookResult = ReturnType<typeof useManageRelatedWordsLazyQuery>;
export type ManageRelatedWordsSuspenseQueryHookResult = ReturnType<typeof useManageRelatedWordsSuspenseQuery>;
export type ManageRelatedWordsQueryResult = Apollo.QueryResult<ManageRelatedWordsQuery, ManageRelatedWordsQueryVariables>;
export const CreateEmptyRelatedWordsGroupDocument = gql`
    mutation CreateEmptyRelatedWordsGroup {
  groupId: createEmptyRelatedWordsGroup
}
    `;
export type CreateEmptyRelatedWordsGroupMutationFn = Apollo.MutationFunction<CreateEmptyRelatedWordsGroupMutation, CreateEmptyRelatedWordsGroupMutationVariables>;

/**
 * __useCreateEmptyRelatedWordsGroupMutation__
 *
 * To run a mutation, you first call `useCreateEmptyRelatedWordsGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmptyRelatedWordsGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmptyRelatedWordsGroupMutation, { data, loading, error }] = useCreateEmptyRelatedWordsGroupMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateEmptyRelatedWordsGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateEmptyRelatedWordsGroupMutation, CreateEmptyRelatedWordsGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEmptyRelatedWordsGroupMutation, CreateEmptyRelatedWordsGroupMutationVariables>(CreateEmptyRelatedWordsGroupDocument, options);
      }
export type CreateEmptyRelatedWordsGroupMutationHookResult = ReturnType<typeof useCreateEmptyRelatedWordsGroupMutation>;
export type CreateEmptyRelatedWordsGroupMutationResult = Apollo.MutationResult<CreateEmptyRelatedWordsGroupMutation>;
export type CreateEmptyRelatedWordsGroupMutationOptions = Apollo.BaseMutationOptions<CreateEmptyRelatedWordsGroupMutation, CreateEmptyRelatedWordsGroupMutationVariables>;
export const DeleteRelatedWordsGroupDocument = gql`
    mutation DeleteRelatedWordsGroup($groupId: Int!) {
  relatedWordsGroup(groupId: $groupId) {
    delete
  }
}
    `;
export type DeleteRelatedWordsGroupMutationFn = Apollo.MutationFunction<DeleteRelatedWordsGroupMutation, DeleteRelatedWordsGroupMutationVariables>;

/**
 * __useDeleteRelatedWordsGroupMutation__
 *
 * To run a mutation, you first call `useDeleteRelatedWordsGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRelatedWordsGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRelatedWordsGroupMutation, { data, loading, error }] = useDeleteRelatedWordsGroupMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useDeleteRelatedWordsGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRelatedWordsGroupMutation, DeleteRelatedWordsGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRelatedWordsGroupMutation, DeleteRelatedWordsGroupMutationVariables>(DeleteRelatedWordsGroupDocument, options);
      }
export type DeleteRelatedWordsGroupMutationHookResult = ReturnType<typeof useDeleteRelatedWordsGroupMutation>;
export type DeleteRelatedWordsGroupMutationResult = Apollo.MutationResult<DeleteRelatedWordsGroupMutation>;
export type DeleteRelatedWordsGroupMutationOptions = Apollo.BaseMutationOptions<DeleteRelatedWordsGroupMutation, DeleteRelatedWordsGroupMutationVariables>;
export const SubmitRelatedWordDocument = gql`
    mutation SubmitRelatedWord($groupId: Int!, $relatedWordInput: RelatedWordInput!) {
  relatedWordsGroup(groupId: $groupId) {
    submitRelatedWord(relatedWordInput: $relatedWordInput) {
      ...RelatedWord
    }
  }
}
    ${RelatedWordFragmentDoc}`;
export type SubmitRelatedWordMutationFn = Apollo.MutationFunction<SubmitRelatedWordMutation, SubmitRelatedWordMutationVariables>;

/**
 * __useSubmitRelatedWordMutation__
 *
 * To run a mutation, you first call `useSubmitRelatedWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitRelatedWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitRelatedWordMutation, { data, loading, error }] = useSubmitRelatedWordMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      relatedWordInput: // value for 'relatedWordInput'
 *   },
 * });
 */
export function useSubmitRelatedWordMutation(baseOptions?: Apollo.MutationHookOptions<SubmitRelatedWordMutation, SubmitRelatedWordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitRelatedWordMutation, SubmitRelatedWordMutationVariables>(SubmitRelatedWordDocument, options);
      }
export type SubmitRelatedWordMutationHookResult = ReturnType<typeof useSubmitRelatedWordMutation>;
export type SubmitRelatedWordMutationResult = Apollo.MutationResult<SubmitRelatedWordMutation>;
export type SubmitRelatedWordMutationOptions = Apollo.BaseMutationOptions<SubmitRelatedWordMutation, SubmitRelatedWordMutationVariables>;
export const EditRelatedWordDocument = gql`
    mutation EditRelatedWord($groupId: Int!, $originalWord: String!, $relatedWordInput: RelatedWordInput!) {
  relatedWordsGroup(groupId: $groupId) {
    relatedWord(word: $originalWord) {
      edit(relatedWordInput: $relatedWordInput) {
        ...RelatedWord
      }
    }
  }
}
    ${RelatedWordFragmentDoc}`;
export type EditRelatedWordMutationFn = Apollo.MutationFunction<EditRelatedWordMutation, EditRelatedWordMutationVariables>;

/**
 * __useEditRelatedWordMutation__
 *
 * To run a mutation, you first call `useEditRelatedWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditRelatedWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editRelatedWordMutation, { data, loading, error }] = useEditRelatedWordMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      originalWord: // value for 'originalWord'
 *      relatedWordInput: // value for 'relatedWordInput'
 *   },
 * });
 */
export function useEditRelatedWordMutation(baseOptions?: Apollo.MutationHookOptions<EditRelatedWordMutation, EditRelatedWordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditRelatedWordMutation, EditRelatedWordMutationVariables>(EditRelatedWordDocument, options);
      }
export type EditRelatedWordMutationHookResult = ReturnType<typeof useEditRelatedWordMutation>;
export type EditRelatedWordMutationResult = Apollo.MutationResult<EditRelatedWordMutation>;
export type EditRelatedWordMutationOptions = Apollo.BaseMutationOptions<EditRelatedWordMutation, EditRelatedWordMutationVariables>;
export const DeleteRelatedWordDocument = gql`
    mutation DeleteRelatedWord($groupId: Int!, $word: String!) {
  relatedWordsGroup(groupId: $groupId) {
    relatedWord(word: $word) {
      delete {
        ...RelatedWord
      }
    }
  }
}
    ${RelatedWordFragmentDoc}`;
export type DeleteRelatedWordMutationFn = Apollo.MutationFunction<DeleteRelatedWordMutation, DeleteRelatedWordMutationVariables>;

/**
 * __useDeleteRelatedWordMutation__
 *
 * To run a mutation, you first call `useDeleteRelatedWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRelatedWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRelatedWordMutation, { data, loading, error }] = useDeleteRelatedWordMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      word: // value for 'word'
 *   },
 * });
 */
export function useDeleteRelatedWordMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRelatedWordMutation, DeleteRelatedWordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRelatedWordMutation, DeleteRelatedWordMutationVariables>(DeleteRelatedWordDocument, options);
      }
export type DeleteRelatedWordMutationHookResult = ReturnType<typeof useDeleteRelatedWordMutation>;
export type DeleteRelatedWordMutationResult = Apollo.MutationResult<DeleteRelatedWordMutation>;
export type DeleteRelatedWordMutationOptions = Apollo.BaseMutationOptions<DeleteRelatedWordMutation, DeleteRelatedWordMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $passwordRepeat: String!) {
  register(
    username: $username
    password: $password
    passwordRepeat: $passwordRepeat
  )
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      passwordRepeat: // value for 'passwordRepeat'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ClaimJwtDocument = gql`
    mutation ClaimJwt($ltiUuid: String!) {
  claimJwt(ltiUuid: $ltiUuid)
}
    `;
export type ClaimJwtMutationFn = Apollo.MutationFunction<ClaimJwtMutation, ClaimJwtMutationVariables>;

/**
 * __useClaimJwtMutation__
 *
 * To run a mutation, you first call `useClaimJwtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimJwtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimJwtMutation, { data, loading, error }] = useClaimJwtMutation({
 *   variables: {
 *      ltiUuid: // value for 'ltiUuid'
 *   },
 * });
 */
export function useClaimJwtMutation(baseOptions?: Apollo.MutationHookOptions<ClaimJwtMutation, ClaimJwtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClaimJwtMutation, ClaimJwtMutationVariables>(ClaimJwtDocument, options);
      }
export type ClaimJwtMutationHookResult = ReturnType<typeof useClaimJwtMutation>;
export type ClaimJwtMutationResult = Apollo.MutationResult<ClaimJwtMutation>;
export type ClaimJwtMutationOptions = Apollo.BaseMutationOptions<ClaimJwtMutation, ClaimJwtMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $password: String!, $passwordRepeat: String!) {
  changePassword(
    oldPassword: $oldPassword
    password: $password
    passwordRepeat: $passwordRepeat
  )
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      password: // value for 'password'
 *      passwordRepeat: // value for 'passwordRepeat'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const UserManagementDocument = gql`
    query UserManagement {
  users {
    ...User
  }
}
    ${UserFragmentDoc}`;

/**
 * __useUserManagementQuery__
 *
 * To run a query within a React component, call `useUserManagementQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserManagementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserManagementQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserManagementQuery(baseOptions?: Apollo.QueryHookOptions<UserManagementQuery, UserManagementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserManagementQuery, UserManagementQueryVariables>(UserManagementDocument, options);
      }
export function useUserManagementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserManagementQuery, UserManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserManagementQuery, UserManagementQueryVariables>(UserManagementDocument, options);
        }
export function useUserManagementSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserManagementQuery, UserManagementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserManagementQuery, UserManagementQueryVariables>(UserManagementDocument, options);
        }
export type UserManagementQueryHookResult = ReturnType<typeof useUserManagementQuery>;
export type UserManagementLazyQueryHookResult = ReturnType<typeof useUserManagementLazyQuery>;
export type UserManagementSuspenseQueryHookResult = ReturnType<typeof useUserManagementSuspenseQuery>;
export type UserManagementQueryResult = Apollo.QueryResult<UserManagementQuery, UserManagementQueryVariables>;
export const ChangeRightsDocument = gql`
    mutation ChangeRights($username: String!, $newRights: Rights!) {
  newRights: changeRights(username: $username, newRights: $newRights)
}
    `;
export type ChangeRightsMutationFn = Apollo.MutationFunction<ChangeRightsMutation, ChangeRightsMutationVariables>;

/**
 * __useChangeRightsMutation__
 *
 * To run a mutation, you first call `useChangeRightsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeRightsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeRightsMutation, { data, loading, error }] = useChangeRightsMutation({
 *   variables: {
 *      username: // value for 'username'
 *      newRights: // value for 'newRights'
 *   },
 * });
 */
export function useChangeRightsMutation(baseOptions?: Apollo.MutationHookOptions<ChangeRightsMutation, ChangeRightsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeRightsMutation, ChangeRightsMutationVariables>(ChangeRightsDocument, options);
      }
export type ChangeRightsMutationHookResult = ReturnType<typeof useChangeRightsMutation>;
export type ChangeRightsMutationResult = Apollo.MutationResult<ChangeRightsMutation>;
export type ChangeRightsMutationOptions = Apollo.BaseMutationOptions<ChangeRightsMutation, ChangeRightsMutationVariables>;
export const HomeDocument = gql`
    query Home {
  exercises {
    ...ExerciseIdentifier
  }
  mySolutions {
    ...SolutionIdentifier
  }
}
    ${ExerciseIdentifierFragmentDoc}
${SolutionIdentifierFragmentDoc}`;

/**
 * __useHomeQuery__
 *
 * To run a query within a React component, call `useHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomeQuery(baseOptions?: Apollo.QueryHookOptions<HomeQuery, HomeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
      }
export function useHomeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeQuery, HomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
        }
export function useHomeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<HomeQuery, HomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
        }
export type HomeQueryHookResult = ReturnType<typeof useHomeQuery>;
export type HomeLazyQueryHookResult = ReturnType<typeof useHomeLazyQuery>;
export type HomeSuspenseQueryHookResult = ReturnType<typeof useHomeSuspenseQuery>;
export type HomeQueryResult = Apollo.QueryResult<HomeQuery, HomeQueryVariables>;
export const CreateExerciseDocument = gql`
    mutation CreateExercise($exerciseInput: ExerciseInput!) {
  exerciseId: createExercise(exerciseInput: $exerciseInput)
}
    `;
export type CreateExerciseMutationFn = Apollo.MutationFunction<CreateExerciseMutation, CreateExerciseMutationVariables>;

/**
 * __useCreateExerciseMutation__
 *
 * To run a mutation, you first call `useCreateExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExerciseMutation, { data, loading, error }] = useCreateExerciseMutation({
 *   variables: {
 *      exerciseInput: // value for 'exerciseInput'
 *   },
 * });
 */
export function useCreateExerciseMutation(baseOptions?: Apollo.MutationHookOptions<CreateExerciseMutation, CreateExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExerciseMutation, CreateExerciseMutationVariables>(CreateExerciseDocument, options);
      }
export type CreateExerciseMutationHookResult = ReturnType<typeof useCreateExerciseMutation>;
export type CreateExerciseMutationResult = Apollo.MutationResult<CreateExerciseMutation>;
export type CreateExerciseMutationOptions = Apollo.BaseMutationOptions<CreateExerciseMutation, CreateExerciseMutationVariables>;
export const ExerciseOverviewDocument = gql`
    query ExerciseOverview($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    ...ExerciseOverview
  }
}
    ${ExerciseOverviewFragmentDoc}`;

/**
 * __useExerciseOverviewQuery__
 *
 * To run a query within a React component, call `useExerciseOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useExerciseOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExerciseOverviewQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useExerciseOverviewQuery(baseOptions: Apollo.QueryHookOptions<ExerciseOverviewQuery, ExerciseOverviewQueryVariables> & ({ variables: ExerciseOverviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>(ExerciseOverviewDocument, options);
      }
export function useExerciseOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>(ExerciseOverviewDocument, options);
        }
export function useExerciseOverviewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>(ExerciseOverviewDocument, options);
        }
export type ExerciseOverviewQueryHookResult = ReturnType<typeof useExerciseOverviewQuery>;
export type ExerciseOverviewLazyQueryHookResult = ReturnType<typeof useExerciseOverviewLazyQuery>;
export type ExerciseOverviewSuspenseQueryHookResult = ReturnType<typeof useExerciseOverviewSuspenseQuery>;
export type ExerciseOverviewQueryResult = Apollo.QueryResult<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>;
export const ExerciseTaskDefinitionDocument = gql`
    query ExerciseTaskDefinition($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    ...ExerciseTaskDefinition
  }
}
    ${ExerciseTaskDefinitionFragmentDoc}`;

/**
 * __useExerciseTaskDefinitionQuery__
 *
 * To run a query within a React component, call `useExerciseTaskDefinitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useExerciseTaskDefinitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExerciseTaskDefinitionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useExerciseTaskDefinitionQuery(baseOptions: Apollo.QueryHookOptions<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables> & ({ variables: ExerciseTaskDefinitionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>(ExerciseTaskDefinitionDocument, options);
      }
export function useExerciseTaskDefinitionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>(ExerciseTaskDefinitionDocument, options);
        }
export function useExerciseTaskDefinitionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>(ExerciseTaskDefinitionDocument, options);
        }
export type ExerciseTaskDefinitionQueryHookResult = ReturnType<typeof useExerciseTaskDefinitionQuery>;
export type ExerciseTaskDefinitionLazyQueryHookResult = ReturnType<typeof useExerciseTaskDefinitionLazyQuery>;
export type ExerciseTaskDefinitionSuspenseQueryHookResult = ReturnType<typeof useExerciseTaskDefinitionSuspenseQuery>;
export type ExerciseTaskDefinitionQueryResult = Apollo.QueryResult<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>;
export const SubmitSolutionDocument = gql`
    mutation SubmitSolution($exerciseId: Int!, $userSolution: UserSolutionInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitSolution(userSolution: $userSolution) {
      __typename
    }
  }
}
    `;
export type SubmitSolutionMutationFn = Apollo.MutationFunction<SubmitSolutionMutation, SubmitSolutionMutationVariables>;

/**
 * __useSubmitSolutionMutation__
 *
 * To run a mutation, you first call `useSubmitSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitSolutionMutation, { data, loading, error }] = useSubmitSolutionMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      userSolution: // value for 'userSolution'
 *   },
 * });
 */
export function useSubmitSolutionMutation(baseOptions?: Apollo.MutationHookOptions<SubmitSolutionMutation, SubmitSolutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitSolutionMutation, SubmitSolutionMutationVariables>(SubmitSolutionDocument, options);
      }
export type SubmitSolutionMutationHookResult = ReturnType<typeof useSubmitSolutionMutation>;
export type SubmitSolutionMutationResult = Apollo.MutationResult<SubmitSolutionMutation>;
export type SubmitSolutionMutationOptions = Apollo.BaseMutationOptions<SubmitSolutionMutation, SubmitSolutionMutationVariables>;