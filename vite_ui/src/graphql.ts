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
  delete: Scalars['Boolean']['output'];
  edit: Abbreviation;
};


export type AbbreviationMutationsEditArgs = {
  abbreviationInput: AbbreviationInput;
};

export type AnnotatedSolutionNode = SolutionNode & {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type Annotation = IAnnotation & {
  annotationType: AnnotationType;
  endIndex: Scalars['Int']['output'];
  errorType: ErrorType;
  id: Scalars['Int']['output'];
  importance: AnnotationImportance;
  startIndex: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export enum AnnotationImportance {
  Less = 'Less',
  Medium = 'Medium',
  More = 'More'
}

export type AnnotationInput = {
  endIndex: Scalars['Int']['input'];
  errorType: ErrorType;
  importance: AnnotationImportance;
  startIndex: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};

export type AnnotationMutations = {
  delete: Scalars['Int']['output'];
  reject: Scalars['Boolean']['output'];
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

export type CorrectionResult = {
  annotations: Array<GeneratedAnnotation>;
  matches: Array<DefaultSolutionNodeMatch>;
};

export enum CorrectionStatus {
  Finished = 'Finished',
  Ongoing = 'Ongoing',
  Waiting = 'Waiting'
}

export type CorrectionSummary = {
  comment: Scalars['String']['output'];
  points: Scalars['Int']['output'];
};

export type DefaultSolutionNodeMatch = ISolutionNodeMatch & {
  certainty?: Maybe<Scalars['Float']['output']>;
  matchStatus: MatchStatus;
  maybeExplanation?: Maybe<SolutionNodeMatchExplanation>;
  paragraphMatchingResult?: Maybe<ParagraphMatchingResult>;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type DirectChildrenMatch = {
  maybeExplanation?: Maybe<SolutionNodeMatchExplanation>;
  sampleValue: AnnotatedSolutionNode;
  userValue: AnnotatedSolutionNode;
};

export type DirectChildrenMatchingResult = {
  certainty: Scalars['Float']['output'];
  matches: Array<DirectChildrenMatch>;
  notMatchedSample: Array<AnnotatedSolutionNode>;
  notMatchedUser: Array<AnnotatedSolutionNode>;
};

export enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export type Exercise = {
  id: Scalars['Int']['output'];
  sampleSolution: Array<FlatSampleSolutionNode>;
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userSolution?: Maybe<UserSolution>;
  userSolutions: Array<UserSolution>;
};


export type ExerciseUserSolutionArgs = {
  username: Scalars['String']['input'];
};

export type ExerciseInput = {
  sampleSolution: Array<FlatSolutionNodeInput>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ExerciseMutations = {
  submitSolution: Scalars['Boolean']['output'];
  userSolution?: Maybe<UserSolutionMutations>;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: UserSolutionInput;
};


export type ExerciseMutationsUserSolutionArgs = {
  username: Scalars['String']['input'];
};

export type FlatSampleSolutionNode = SolutionNode & {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  subTexts: Array<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};

export type FlatSolutionNodeInput = {
  applicability: Applicability;
  childIndex: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
  isSubText: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type FlatUserSolutionNode = SolutionNode & {
  addAnnotationPreviewMatch: CorrectionResult;
  annotationTextRecommendations: Array<Scalars['String']['output']>;
  annotations: Array<Annotation>;
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};


export type FlatUserSolutionNodeAddAnnotationPreviewMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};


export type FlatUserSolutionNodeAnnotationTextRecommendationsArgs = {
  endIndex: Scalars['Int']['input'];
  startIndex: Scalars['Int']['input'];
};

export type GeneratedAnnotation = IAnnotation & {
  annotationType: AnnotationType;
  certainty?: Maybe<Scalars['Float']['output']>;
  endIndex: Scalars['Int']['output'];
  errorType: ErrorType;
  id: Scalars['Int']['output'];
  importance: AnnotationImportance;
  nodeId: Scalars['Int']['output'];
  startIndex: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type IAnnotation = {
  annotationType: AnnotationType;
  endIndex: Scalars['Int']['output'];
  errorType: ErrorType;
  id: Scalars['Int']['output'];
  importance: AnnotationImportance;
  startIndex: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type IParagraphSynonymIdentifier = {
  lawCode: Scalars['String']['output'];
  paragraphNumber: Scalars['Int']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['Int']['output'];
};

export type ISolutionNodeMatch = {
  certainty?: Maybe<Scalars['Float']['output']>;
  matchStatus: MatchStatus;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type MatchExplanation = {
  certainty: Scalars['Float']['output'];
};

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
  maybeSentenceNumber?: InputMaybe<Scalars['Int']['input']>;
  paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput;
  synonym: Scalars['String']['input'];
};

export type ParagraphCitation = {
  identifier: ParagraphSynonymIdentifier;
  lawCode: Scalars['String']['output'];
  paragraphNumber: Scalars['Int']['output'];
  paragraphType: Scalars['String']['output'];
  rest: Scalars['String']['output'];
  section?: Maybe<Scalars['Int']['output']>;
};

export type ParagraphCitationLocation = {
  citedParagraphs: Array<ParagraphCitation>;
  from: Scalars['Int']['output'];
  to: Scalars['Int']['output'];
};

export type ParagraphCitationMatchExplanation = MatchExplanation & {
  certainty: Scalars['Float']['output'];
  paragraphTypeEqual: Scalars['Boolean']['output'];
};

export type ParagraphMatch = {
  maybeExplanation?: Maybe<ParagraphCitationMatchExplanation>;
  sampleValue: ParagraphCitation;
  userValue: ParagraphCitation;
};

export type ParagraphMatchingResult = {
  certainty: Scalars['Float']['output'];
  matches: Array<ParagraphMatch>;
  notMatchedSample: Array<ParagraphCitation>;
  notMatchedUser: Array<ParagraphCitation>;
};

export type ParagraphSynonym = IParagraphSynonymIdentifier & {
  lawCode: Scalars['String']['output'];
  paragraphNumber: Scalars['Int']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['Int']['output'];
  sentenceNumber?: Maybe<Scalars['Int']['output']>;
  synonym: Scalars['String']['output'];
};

export type ParagraphSynonymIdentifier = IParagraphSynonymIdentifier & {
  lawCode: Scalars['String']['output'];
  paragraphNumber: Scalars['Int']['output'];
  paragraphType: Scalars['String']['output'];
  section: Scalars['Int']['output'];
};

export type ParagraphSynonymIdentifierInput = {
  lawCode: Scalars['String']['input'];
  paragraphNumber: Scalars['Int']['input'];
  paragraphType: Scalars['String']['input'];
  section: Scalars['Int']['input'];
};

export type ParagraphSynonymInput = {
  lawCode: Scalars['String']['input'];
  paragraphNumber: Scalars['Int']['input'];
  paragraphType: Scalars['String']['input'];
  section: Scalars['Int']['input'];
  sentenceNumber?: InputMaybe<Scalars['Int']['input']>;
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
  delete: Scalars['Boolean']['output'];
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
  sampleSolution: Array<FlatSampleSolutionNode>;
  userSolution: Array<FlatUserSolutionNode>;
};

export enum Rights {
  Admin = 'Admin',
  Corrector = 'Corrector',
  Student = 'Student'
}

export type SolutionIdentifier = {
  correctionStatus?: Maybe<CorrectionStatus>;
  exerciseId: Scalars['Int']['output'];
  exerciseTitle: Scalars['String']['output'];
};

export type SolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type SolutionNodeMatch = ISolutionNodeMatch & {
  certainty?: Maybe<Scalars['Float']['output']>;
  matchStatus: MatchStatus;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type SolutionNodeMatchExplanation = MatchExplanation & {
  certainty: Scalars['Float']['output'];
  maybeDirectChildrenMatchingResult?: Maybe<DirectChildrenMatchingResult>;
  maybeParagraphMatchingResult?: Maybe<ParagraphMatchingResult>;
  maybeWordMatchingResult?: Maybe<WordMatchingResult>;
};

export type User = {
  rights: Rights;
  username: Scalars['String']['output'];
};

export type UserSolution = {
  correctionStatus: CorrectionStatus;
  correctionSummary?: Maybe<CorrectionSummary>;
  matches: Array<SolutionNodeMatch>;
  node?: Maybe<FlatUserSolutionNode>;
  nodes: Array<FlatUserSolutionNode>;
  performCurrentCorrection: CorrectionResult;
  username: Scalars['String']['output'];
};


export type UserSolutionNodeArgs = {
  userSolutionNodeId: Scalars['Int']['input'];
};

export type UserSolutionInput = {
  solution: Array<FlatSolutionNodeInput>;
  username: Scalars['String']['input'];
};

export type UserSolutionMutations = {
  finishCorrection: CorrectionStatus;
  initiateCorrection: CorrectionStatus;
  node?: Maybe<UserSolutionNode>;
  updateCorrectionResult: CorrectionSummary;
};


export type UserSolutionMutationsNodeArgs = {
  userSolutionNodeId: Scalars['Int']['input'];
};


export type UserSolutionMutationsUpdateCorrectionResultArgs = {
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
};

export type UserSolutionNode = {
  annotation?: Maybe<AnnotationMutations>;
  deleteMatch: Scalars['Boolean']['output'];
  submitMatch: SolutionNodeMatch;
  upsertAnnotation: Annotation;
};


export type UserSolutionNodeAnnotationArgs = {
  annotationId: Scalars['Int']['input'];
};


export type UserSolutionNodeDeleteMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};


export type UserSolutionNodeSubmitMatchArgs = {
  sampleSolutionNodeId: Scalars['Int']['input'];
};


export type UserSolutionNodeUpsertAnnotationArgs = {
  annotation: AnnotationInput;
  maybeAnnotationId?: InputMaybe<Scalars['Int']['input']>;
};

export type WordMatch = {
  maybeExplanation?: Maybe<WordMatchExplanation>;
  sampleValue: WordWithRelatedWords;
  userValue: WordWithRelatedWords;
};

export type WordMatchExplanation = MatchExplanation & {
  certainty: Scalars['Float']['output'];
  distance: Scalars['Int']['output'];
  maxLength: Scalars['Int']['output'];
};

export type WordMatchingResult = {
  certainty: Scalars['Float']['output'];
  matches: Array<WordMatch>;
  notMatchedSample: Array<WordWithRelatedWords>;
  notMatchedUser: Array<WordWithRelatedWords>;
};

export type WordWithRelatedWords = {
  antonyms: Array<Scalars['String']['output']>;
  synonyms: Array<Scalars['String']['output']>;
  word: Scalars['String']['output'];
};

export type SubmitNewMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type SubmitNewMatchMutation = { exerciseMutations?: { userSolution?: { node?: { submitMatch: SolutionNodeMatchFragment } | null } | null } | null };

export type DeleteMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type DeleteMatchMutation = { exerciseMutations?: { userSolution?: { node?: { deleteMatch: boolean } | null } | null } | null };

export type UpsertAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  nodeId: Scalars['Int']['input'];
  maybeAnnotationId?: InputMaybe<Scalars['Int']['input']>;
  annotationInput: AnnotationInput;
}>;


export type UpsertAnnotationMutation = { exerciseMutations?: { userSolution?: { node?: { upsertAnnotation: Annotation_Annotation_Fragment } | null } | null } | null };

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


export type FinishCorrectionMutation = { exerciseMutations?: { userSolution?: { finishCorrection: CorrectionStatus } | null } | null };

type SolutionNode_AnnotatedSolutionNode_Fragment = { id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

type SolutionNode_FlatSampleSolutionNode_Fragment = { id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

type SolutionNode_FlatUserSolutionNode_Fragment = { id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

export type SolutionNodeFragment = SolutionNode_AnnotatedSolutionNode_Fragment | SolutionNode_FlatSampleSolutionNode_Fragment | SolutionNode_FlatUserSolutionNode_Fragment;

export type SampleSolutionNodeFragment = (
  { subTexts: Array<string> }
  & SolutionNode_FlatSampleSolutionNode_Fragment
);

type Annotation_Annotation_Fragment = { id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string };

type Annotation_GeneratedAnnotation_Fragment = { id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string };

export type AnnotationFragment = Annotation_Annotation_Fragment | Annotation_GeneratedAnnotation_Fragment;

export type FlatUserSolutionNodeFragment = (
  { annotations: Array<Annotation_Annotation_Fragment> }
  & SolutionNode_FlatUserSolutionNode_Fragment
);

export type SolutionNodeMatchFragment = { sampleNodeId: number, userNodeId: number, matchStatus: MatchStatus, certainty?: number | null };

export type CorrectionSummaryFragment = { comment: string, points: number };

export type UserSolutionFragment = { correctionStatus: CorrectionStatus, nodes: Array<FlatUserSolutionNodeFragment>, matches: Array<SolutionNodeMatchFragment>, correctionSummary?: CorrectionSummaryFragment | null };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type NewCorrectionQuery = { exercise?: { sampleSolution: Array<SampleSolutionNodeFragment>, userSolution?: UserSolutionFragment | null } | null };

type ISolutionNodeMatch_DefaultSolutionNodeMatch_Fragment = { sampleNodeId: number, userNodeId: number, matchStatus: MatchStatus, certainty?: number | null };

type ISolutionNodeMatch_SolutionNodeMatch_Fragment = { sampleNodeId: number, userNodeId: number, matchStatus: MatchStatus, certainty?: number | null };

export type ISolutionNodeMatchFragment = ISolutionNodeMatch_DefaultSolutionNodeMatch_Fragment | ISolutionNodeMatch_SolutionNodeMatch_Fragment;

export type WordWithRelatedWordsFragment = { word: string, synonyms: Array<string>, antonyms: Array<string> };

export type WordMatchingResultFragment = { certainty: number, matches: Array<{ sampleValue: WordWithRelatedWordsFragment, userValue: WordWithRelatedWordsFragment }>, notMatchedSample: Array<WordWithRelatedWordsFragment>, notMatchedUser: Array<WordWithRelatedWordsFragment> };

export type ParagraphMatchingResultFragment = { certainty: number, matches: Array<{ sampleValue: ParagraphCitationFragment, userValue: ParagraphCitationFragment }>, notMatchedSample: Array<ParagraphCitationFragment>, notMatchedUser: Array<ParagraphCitationFragment> };

export type DirectChildrenMatchingResultFragment = { certainty: number, matches: Array<{ sampleValue: { __typename: 'AnnotatedSolutionNode' }, userValue: { __typename: 'AnnotatedSolutionNode' } }>, notMatchedSample: Array<{ __typename: 'AnnotatedSolutionNode' }>, notMatchedUser: Array<{ __typename: 'AnnotatedSolutionNode' }> };

export type SolNodeMatchExplanationFragment = { certainty: number, maybeWordMatchingResult?: WordMatchingResultFragment | null, maybeParagraphMatchingResult?: ParagraphMatchingResultFragment | null };

export type DefaultSolutionNodeMatchFragment = (
  { paragraphMatchingResult?: ParagraphMatchingResultFragment | null, maybeExplanation?: SolNodeMatchExplanationFragment | null }
  & ISolutionNodeMatch_DefaultSolutionNodeMatch_Fragment
);

export type GeneratedAnnotationFragment = (
  { nodeId: number }
  & Annotation_GeneratedAnnotation_Fragment
);

export type CorrectionResultFragment = { matches: Array<DefaultSolutionNodeMatchFragment>, annotations: Array<GeneratedAnnotationFragment> };

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


export type DeleteAbbreviationMutation = { abbreviation?: { delete: boolean } | null };

export type UpdateAbbreviationMutationVariables = Exact<{
  abbreviation: Scalars['String']['input'];
  abbreviationInput: AbbreviationInput;
}>;


export type UpdateAbbreviationMutation = { abbreviation?: { edit: AbbreviationFragment } | null };

type ParagraphSynonymIdentifier_ParagraphSynonym_Fragment = { paragraphType: string, paragraphNumber: number, section: number, lawCode: string };

type ParagraphSynonymIdentifier_ParagraphSynonymIdentifier_Fragment = { paragraphType: string, paragraphNumber: number, section: number, lawCode: string };

export type ParagraphSynonymIdentifierFragment = ParagraphSynonymIdentifier_ParagraphSynonym_Fragment | ParagraphSynonymIdentifier_ParagraphSynonymIdentifier_Fragment;

export type ParagraphSynonymFragment = (
  { sentenceNumber?: number | null, synonym: string }
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
  maybeSentenceNumber?: InputMaybe<Scalars['Int']['input']>;
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


export type DeleteRelatedWordMutation = { relatedWordsGroup?: { relatedWord?: { delete: boolean } | null } | null };

export type ParagraphIdentifierFragment = { paragraphType: string, paragraphNumber: number, section: number, lawCode: string };

export type ParagraphCitationFragment = { paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string };

export type ParagraphCitationLocationFragment = { from: number, to: number, citedParagraphs: Array<ParagraphCitationFragment> };

export type UserSelectionExerciseDataFragment = { sampleSolutionNodes: Array<MatchingReviewSolNode_FlatSampleSolutionNode_Fragment>, usernames: Array<{ username: string }> };

export type AnnotationUsernameSelectionDataQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type AnnotationUsernameSelectionDataQuery = { exercise?: UserSelectionExerciseDataFragment | null };

type MatchingReviewSolNode_AnnotatedSolutionNode_Fragment = (
  { paragraphCitationLocations: Array<ParagraphCitationLocationFragment> }
  & PreviewSolNode_AnnotatedSolutionNode_Fragment
);

type MatchingReviewSolNode_FlatSampleSolutionNode_Fragment = (
  { paragraphCitationLocations: Array<ParagraphCitationLocationFragment> }
  & PreviewSolNode_FlatSampleSolutionNode_Fragment
);

type MatchingReviewSolNode_FlatUserSolutionNode_Fragment = (
  { paragraphCitationLocations: Array<ParagraphCitationLocationFragment> }
  & PreviewSolNode_FlatUserSolutionNode_Fragment
);

export type MatchingReviewSolNodeFragment = MatchingReviewSolNode_AnnotatedSolutionNode_Fragment | MatchingReviewSolNode_FlatSampleSolutionNode_Fragment | MatchingReviewSolNode_FlatUserSolutionNode_Fragment;

export type AnnotationUserSolutionDataQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type AnnotationUserSolutionDataQuery = { exercise?: { userSolution?: { userSolutionNodes: Array<MatchingReviewSolNode_FlatUserSolutionNode_Fragment>, correctionResult: CorrectionResultFragment } | null } | null };

export type AddSubTreeMatchQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type AddSubTreeMatchQuery = { exercise?: { userSolution?: { node?: { addAnnotationPreviewMatch: { newMatches: Array<DefaultSolutionNodeMatchFragment>, newAnnotations: Array<GeneratedAnnotationFragment> } } | null } | null } | null };

type PreviewSolNode_AnnotatedSolutionNode_Fragment = { id: number, childIndex: number, text: string, isSubText: boolean, applicability: Applicability, parentId?: number | null };

type PreviewSolNode_FlatSampleSolutionNode_Fragment = { id: number, childIndex: number, text: string, isSubText: boolean, applicability: Applicability, parentId?: number | null };

type PreviewSolNode_FlatUserSolutionNode_Fragment = { id: number, childIndex: number, text: string, isSubText: boolean, applicability: Applicability, parentId?: number | null };

export type PreviewSolNodeFragment = PreviewSolNode_AnnotatedSolutionNode_Fragment | PreviewSolNode_FlatSampleSolutionNode_Fragment | PreviewSolNode_FlatUserSolutionNode_Fragment;

export type AllExerciseIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllExerciseIdsQuery = { exercises: Array<{ id: number }> };

export type SolutionIdentifierFragment = { exerciseId: number, exerciseTitle: string, correctionStatus?: CorrectionStatus | null };

export type ExerciseIdentifierFragment = { id: number, title: string };

export type HomeQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeQuery = { exercises: Array<ExerciseIdentifierFragment>, mySolutions: Array<SolutionIdentifierFragment> };

export type CreateExerciseMutationVariables = Exact<{
  exerciseInput: ExerciseInput;
}>;


export type CreateExerciseMutation = { createExercise: number };

export type ExerciseOverviewFragment = { title: string, text: string, userSolutions: Array<{ username: string, correctionStatus: CorrectionStatus }> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseOverviewQuery = { exercise?: ExerciseOverviewFragment | null };

export type InitiateCorrectionMutationVariables = Exact<{
  username: Scalars['String']['input'];
  exerciseId: Scalars['Int']['input'];
}>;


export type InitiateCorrectionMutation = { exerciseMutations?: { userSolution?: { initiateCorrection: CorrectionStatus } | null } | null };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseTaskDefinitionQuery = { exercise?: ExerciseTaskDefinitionFragment | null };

export type ExerciseTaskDefinitionFragment = { title: string, text: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  userSolution: UserSolutionInput;
}>;


export type SubmitSolutionMutation = { exerciseMutations?: { submitSolution: boolean } | null };

export type ReviewDataFragment = { comment: string, points: number, userSolution: Array<FlatUserSolutionNodeFragment>, sampleSolution: Array<SolutionNode_FlatSampleSolutionNode_Fragment>, matches: Array<SolutionNodeMatchFragment> };

export type CorrectionReviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type CorrectionReviewQuery = { reviewCorrection: ReviewDataFragment };

export type AnnotationTextRecommendationQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  userSolutionNodeId: Scalars['Int']['input'];
  startIndex: Scalars['Int']['input'];
  endIndex: Scalars['Int']['input'];
}>;


export type AnnotationTextRecommendationQuery = { exercise?: { userSolution?: { node?: { textRecommendations: Array<string> } | null } | null } | null };

export type CorrectionReviewByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CorrectionReviewByUuidQuery = { reviewCorrectionByUuid?: ReviewDataFragment | null };

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


export type ChangeRightsMutation = { changeRights: Rights };

export const SolutionNodeFragmentDoc = gql`
    fragment SolutionNode on SolutionNode {
  id
  childIndex
  isSubText
  text
  applicability
  parentId
}
    `;
export const SampleSolutionNodeFragmentDoc = gql`
    fragment SampleSolutionNode on FlatSampleSolutionNode {
  ...SolutionNode
  subTexts
}
    ${SolutionNodeFragmentDoc}`;
export const AnnotationFragmentDoc = gql`
    fragment Annotation on IAnnotation {
  id
  errorType
  importance
  startIndex
  endIndex
  text
}
    `;
export const FlatUserSolutionNodeFragmentDoc = gql`
    fragment FlatUserSolutionNode on FlatUserSolutionNode {
  ...SolutionNode
  annotations {
    ...Annotation
  }
}
    ${SolutionNodeFragmentDoc}
${AnnotationFragmentDoc}`;
export const SolutionNodeMatchFragmentDoc = gql`
    fragment SolutionNodeMatch on SolutionNodeMatch {
  sampleNodeId
  userNodeId
  matchStatus
  certainty
}
    `;
export const CorrectionSummaryFragmentDoc = gql`
    fragment CorrectionSummary on CorrectionSummary {
  comment
  points
}
    `;
export const UserSolutionFragmentDoc = gql`
    fragment UserSolution on UserSolution {
  correctionStatus
  nodes {
    ...FlatUserSolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
  correctionSummary {
    ...CorrectionSummary
  }
}
    ${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}
${CorrectionSummaryFragmentDoc}`;
export const DirectChildrenMatchingResultFragmentDoc = gql`
    fragment DirectChildrenMatchingResult on DirectChildrenMatchingResult {
  matches {
    sampleValue {
      __typename
    }
    userValue {
      __typename
    }
  }
  notMatchedSample {
    __typename
  }
  notMatchedUser {
    __typename
  }
  certainty
}
    `;
export const ISolutionNodeMatchFragmentDoc = gql`
    fragment ISolutionNodeMatch on ISolutionNodeMatch {
  sampleNodeId
  userNodeId
  matchStatus
  certainty
}
    `;
export const ParagraphCitationFragmentDoc = gql`
    fragment ParagraphCitation on ParagraphCitation {
  paragraphType
  paragraphNumber
  section
  rest
  lawCode
}
    `;
export const ParagraphMatchingResultFragmentDoc = gql`
    fragment ParagraphMatchingResult on ParagraphMatchingResult {
  matches {
    sampleValue {
      ...ParagraphCitation
    }
    userValue {
      ...ParagraphCitation
    }
  }
  notMatchedSample {
    ...ParagraphCitation
  }
  notMatchedUser {
    ...ParagraphCitation
  }
  certainty
}
    ${ParagraphCitationFragmentDoc}`;
export const WordWithRelatedWordsFragmentDoc = gql`
    fragment WordWithRelatedWords on WordWithRelatedWords {
  word
  synonyms
  antonyms
}
    `;
export const WordMatchingResultFragmentDoc = gql`
    fragment WordMatchingResult on WordMatchingResult {
  matches {
    sampleValue {
      ...WordWithRelatedWords
    }
    userValue {
      ...WordWithRelatedWords
    }
  }
  notMatchedSample {
    ...WordWithRelatedWords
  }
  notMatchedUser {
    ...WordWithRelatedWords
  }
  certainty
}
    ${WordWithRelatedWordsFragmentDoc}`;
export const SolNodeMatchExplanationFragmentDoc = gql`
    fragment SolNodeMatchExplanation on SolutionNodeMatchExplanation {
  maybeWordMatchingResult {
    ...WordMatchingResult
  }
  maybeParagraphMatchingResult {
    ...ParagraphMatchingResult
  }
  certainty
}
    ${WordMatchingResultFragmentDoc}
${ParagraphMatchingResultFragmentDoc}`;
export const DefaultSolutionNodeMatchFragmentDoc = gql`
    fragment DefaultSolutionNodeMatch on DefaultSolutionNodeMatch {
  ...ISolutionNodeMatch
  paragraphMatchingResult {
    ...ParagraphMatchingResult
  }
  maybeExplanation {
    ...SolNodeMatchExplanation
  }
}
    ${ISolutionNodeMatchFragmentDoc}
${ParagraphMatchingResultFragmentDoc}
${SolNodeMatchExplanationFragmentDoc}`;
export const GeneratedAnnotationFragmentDoc = gql`
    fragment GeneratedAnnotation on GeneratedAnnotation {
  nodeId
  ...Annotation
}
    ${AnnotationFragmentDoc}`;
export const CorrectionResultFragmentDoc = gql`
    fragment CorrectionResult on CorrectionResult {
  matches {
    ...DefaultSolutionNodeMatch
  }
  annotations {
    ...GeneratedAnnotation
  }
}
    ${DefaultSolutionNodeMatchFragmentDoc}
${GeneratedAnnotationFragmentDoc}`;
export const AbbreviationFragmentDoc = gql`
    fragment Abbreviation on Abbreviation {
  abbreviation
  word
}
    `;
export const ParagraphSynonymIdentifierFragmentDoc = gql`
    fragment ParagraphSynonymIdentifier on IParagraphSynonymIdentifier {
  paragraphType
  paragraphNumber
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
export const ParagraphIdentifierFragmentDoc = gql`
    fragment ParagraphIdentifier on ParagraphSynonymIdentifier {
  paragraphType
  paragraphNumber
  section
  lawCode
}
    `;
export const PreviewSolNodeFragmentDoc = gql`
    fragment PreviewSolNode on SolutionNode {
  id
  childIndex
  text
  isSubText
  applicability
  parentId
}
    `;
export const ParagraphCitationLocationFragmentDoc = gql`
    fragment ParagraphCitationLocation on ParagraphCitationLocation {
  from
  to
  citedParagraphs {
    ...ParagraphCitation
  }
}
    ${ParagraphCitationFragmentDoc}`;
export const MatchingReviewSolNodeFragmentDoc = gql`
    fragment MatchingReviewSolNode on SolutionNode {
  ...PreviewSolNode
  paragraphCitationLocations {
    ...ParagraphCitationLocation
  }
}
    ${PreviewSolNodeFragmentDoc}
${ParagraphCitationLocationFragmentDoc}`;
export const UserSelectionExerciseDataFragmentDoc = gql`
    fragment UserSelectionExerciseData on Exercise {
  sampleSolutionNodes: sampleSolution {
    ...MatchingReviewSolNode
  }
  usernames: userSolutions {
    username
  }
}
    ${MatchingReviewSolNodeFragmentDoc}`;
export const SolutionIdentifierFragmentDoc = gql`
    fragment SolutionIdentifier on SolutionIdentifier {
  exerciseId
  exerciseTitle
  correctionStatus
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
    correctionStatus
  }
}
    `;
export const ExerciseTaskDefinitionFragmentDoc = gql`
    fragment ExerciseTaskDefinition on Exercise {
  title
  text
}
    `;
export const ReviewDataFragmentDoc = gql`
    fragment ReviewData on ReviewData {
  userSolution {
    ...FlatUserSolutionNode
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
    ${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  username
  rights
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
        deleteMatch(sampleSolutionNodeId: $sampleNodeId)
      }
    }
  }
}
    `;
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
export const UpsertAnnotationDocument = gql`
    mutation UpsertAnnotation($exerciseId: Int!, $username: String!, $nodeId: Int!, $maybeAnnotationId: Int, $annotationInput: AnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $nodeId) {
        upsertAnnotation(
          maybeAnnotationId: $maybeAnnotationId
          annotation: $annotationInput
        ) {
          ...Annotation
        }
      }
    }
  }
}
    ${AnnotationFragmentDoc}`;
export type UpsertAnnotationMutationFn = Apollo.MutationFunction<UpsertAnnotationMutation, UpsertAnnotationMutationVariables>;

/**
 * __useUpsertAnnotationMutation__
 *
 * To run a mutation, you first call `useUpsertAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertAnnotationMutation, { data, loading, error }] = useUpsertAnnotationMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      nodeId: // value for 'nodeId'
 *      maybeAnnotationId: // value for 'maybeAnnotationId'
 *      annotationInput: // value for 'annotationInput'
 *   },
 * });
 */
export function useUpsertAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<UpsertAnnotationMutation, UpsertAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertAnnotationMutation, UpsertAnnotationMutationVariables>(UpsertAnnotationDocument, options);
      }
export type UpsertAnnotationMutationHookResult = ReturnType<typeof useUpsertAnnotationMutation>;
export type UpsertAnnotationMutationResult = Apollo.MutationResult<UpsertAnnotationMutation>;
export type UpsertAnnotationMutationOptions = Apollo.BaseMutationOptions<UpsertAnnotationMutation, UpsertAnnotationMutationVariables>;
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
export const NewCorrectionDocument = gql`
    query NewCorrection($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    sampleSolution {
      ...SampleSolutionNode
    }
    userSolution(username: $username) {
      ...UserSolution
    }
  }
}
    ${SampleSolutionNodeFragmentDoc}
${UserSolutionFragmentDoc}`;

/**
 * __useNewCorrectionQuery__
 *
 * To run a query within a React component, call `useNewCorrectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewCorrectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewCorrectionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useNewCorrectionQuery(baseOptions: Apollo.QueryHookOptions<NewCorrectionQuery, NewCorrectionQueryVariables> & ({ variables: NewCorrectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewCorrectionQuery, NewCorrectionQueryVariables>(NewCorrectionDocument, options);
      }
export function useNewCorrectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewCorrectionQuery, NewCorrectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewCorrectionQuery, NewCorrectionQueryVariables>(NewCorrectionDocument, options);
        }
export function useNewCorrectionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NewCorrectionQuery, NewCorrectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NewCorrectionQuery, NewCorrectionQueryVariables>(NewCorrectionDocument, options);
        }
export type NewCorrectionQueryHookResult = ReturnType<typeof useNewCorrectionQuery>;
export type NewCorrectionLazyQueryHookResult = ReturnType<typeof useNewCorrectionLazyQuery>;
export type NewCorrectionSuspenseQueryHookResult = ReturnType<typeof useNewCorrectionSuspenseQuery>;
export type NewCorrectionQueryResult = Apollo.QueryResult<NewCorrectionQuery, NewCorrectionQueryVariables>;
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
    delete
  }
}
    `;
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
    mutation UpdateParagraphSynonym($paragraphSynonymIdentifierInput: ParagraphSynonymIdentifierInput!, $maybeSentenceNumber: Int, $synonym: String!) {
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
      delete
    }
  }
}
    `;
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
export const AnnotationUsernameSelectionDataDocument = gql`
    query AnnotationUsernameSelectionData($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    ...UserSelectionExerciseData
  }
}
    ${UserSelectionExerciseDataFragmentDoc}`;

/**
 * __useAnnotationUsernameSelectionDataQuery__
 *
 * To run a query within a React component, call `useAnnotationUsernameSelectionDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnotationUsernameSelectionDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnotationUsernameSelectionDataQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useAnnotationUsernameSelectionDataQuery(baseOptions: Apollo.QueryHookOptions<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables> & ({ variables: AnnotationUsernameSelectionDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>(AnnotationUsernameSelectionDataDocument, options);
      }
export function useAnnotationUsernameSelectionDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>(AnnotationUsernameSelectionDataDocument, options);
        }
export function useAnnotationUsernameSelectionDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>(AnnotationUsernameSelectionDataDocument, options);
        }
export type AnnotationUsernameSelectionDataQueryHookResult = ReturnType<typeof useAnnotationUsernameSelectionDataQuery>;
export type AnnotationUsernameSelectionDataLazyQueryHookResult = ReturnType<typeof useAnnotationUsernameSelectionDataLazyQuery>;
export type AnnotationUsernameSelectionDataSuspenseQueryHookResult = ReturnType<typeof useAnnotationUsernameSelectionDataSuspenseQuery>;
export type AnnotationUsernameSelectionDataQueryResult = Apollo.QueryResult<AnnotationUsernameSelectionDataQuery, AnnotationUsernameSelectionDataQueryVariables>;
export const AnnotationUserSolutionDataDocument = gql`
    query AnnotationUserSolutionData($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      userSolutionNodes: nodes {
        ...MatchingReviewSolNode
      }
      correctionResult: performCurrentCorrection {
        ...CorrectionResult
      }
    }
  }
}
    ${MatchingReviewSolNodeFragmentDoc}
${CorrectionResultFragmentDoc}`;

/**
 * __useAnnotationUserSolutionDataQuery__
 *
 * To run a query within a React component, call `useAnnotationUserSolutionDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnotationUserSolutionDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnotationUserSolutionDataQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useAnnotationUserSolutionDataQuery(baseOptions: Apollo.QueryHookOptions<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables> & ({ variables: AnnotationUserSolutionDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>(AnnotationUserSolutionDataDocument, options);
      }
export function useAnnotationUserSolutionDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>(AnnotationUserSolutionDataDocument, options);
        }
export function useAnnotationUserSolutionDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>(AnnotationUserSolutionDataDocument, options);
        }
export type AnnotationUserSolutionDataQueryHookResult = ReturnType<typeof useAnnotationUserSolutionDataQuery>;
export type AnnotationUserSolutionDataLazyQueryHookResult = ReturnType<typeof useAnnotationUserSolutionDataLazyQuery>;
export type AnnotationUserSolutionDataSuspenseQueryHookResult = ReturnType<typeof useAnnotationUserSolutionDataSuspenseQuery>;
export type AnnotationUserSolutionDataQueryResult = Apollo.QueryResult<AnnotationUserSolutionDataQuery, AnnotationUserSolutionDataQueryVariables>;
export const AddSubTreeMatchDocument = gql`
    query AddSubTreeMatch($exerciseId: Int!, $username: String!, $sampleNodeId: Int!, $userNodeId: Int!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userNodeId) {
        addAnnotationPreviewMatch(sampleSolutionNodeId: $sampleNodeId) {
          newMatches: matches {
            ...DefaultSolutionNodeMatch
          }
          newAnnotations: annotations {
            ...GeneratedAnnotation
          }
        }
      }
    }
  }
}
    ${DefaultSolutionNodeMatchFragmentDoc}
${GeneratedAnnotationFragmentDoc}`;

/**
 * __useAddSubTreeMatchQuery__
 *
 * To run a query within a React component, call `useAddSubTreeMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddSubTreeMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddSubTreeMatchQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      sampleNodeId: // value for 'sampleNodeId'
 *      userNodeId: // value for 'userNodeId'
 *   },
 * });
 */
export function useAddSubTreeMatchQuery(baseOptions: Apollo.QueryHookOptions<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables> & ({ variables: AddSubTreeMatchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>(AddSubTreeMatchDocument, options);
      }
export function useAddSubTreeMatchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>(AddSubTreeMatchDocument, options);
        }
export function useAddSubTreeMatchSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>(AddSubTreeMatchDocument, options);
        }
export type AddSubTreeMatchQueryHookResult = ReturnType<typeof useAddSubTreeMatchQuery>;
export type AddSubTreeMatchLazyQueryHookResult = ReturnType<typeof useAddSubTreeMatchLazyQuery>;
export type AddSubTreeMatchSuspenseQueryHookResult = ReturnType<typeof useAddSubTreeMatchSuspenseQuery>;
export type AddSubTreeMatchQueryResult = Apollo.QueryResult<AddSubTreeMatchQuery, AddSubTreeMatchQueryVariables>;
export const AllExerciseIdsDocument = gql`
    query AllExerciseIds {
  exercises {
    id
  }
}
    `;

/**
 * __useAllExerciseIdsQuery__
 *
 * To run a query within a React component, call `useAllExerciseIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllExerciseIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllExerciseIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllExerciseIdsQuery(baseOptions?: Apollo.QueryHookOptions<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>(AllExerciseIdsDocument, options);
      }
export function useAllExerciseIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>(AllExerciseIdsDocument, options);
        }
export function useAllExerciseIdsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>(AllExerciseIdsDocument, options);
        }
export type AllExerciseIdsQueryHookResult = ReturnType<typeof useAllExerciseIdsQuery>;
export type AllExerciseIdsLazyQueryHookResult = ReturnType<typeof useAllExerciseIdsLazyQuery>;
export type AllExerciseIdsSuspenseQueryHookResult = ReturnType<typeof useAllExerciseIdsSuspenseQuery>;
export type AllExerciseIdsQueryResult = Apollo.QueryResult<AllExerciseIdsQuery, AllExerciseIdsQueryVariables>;
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
  createExercise(exerciseInput: $exerciseInput)
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
export const InitiateCorrectionDocument = gql`
    mutation InitiateCorrection($username: String!, $exerciseId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      initiateCorrection
    }
  }
}
    `;
export type InitiateCorrectionMutationFn = Apollo.MutationFunction<InitiateCorrectionMutation, InitiateCorrectionMutationVariables>;

/**
 * __useInitiateCorrectionMutation__
 *
 * To run a mutation, you first call `useInitiateCorrectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitiateCorrectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initiateCorrectionMutation, { data, loading, error }] = useInitiateCorrectionMutation({
 *   variables: {
 *      username: // value for 'username'
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useInitiateCorrectionMutation(baseOptions?: Apollo.MutationHookOptions<InitiateCorrectionMutation, InitiateCorrectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitiateCorrectionMutation, InitiateCorrectionMutationVariables>(InitiateCorrectionDocument, options);
      }
export type InitiateCorrectionMutationHookResult = ReturnType<typeof useInitiateCorrectionMutation>;
export type InitiateCorrectionMutationResult = Apollo.MutationResult<InitiateCorrectionMutation>;
export type InitiateCorrectionMutationOptions = Apollo.BaseMutationOptions<InitiateCorrectionMutation, InitiateCorrectionMutationVariables>;
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
    submitSolution(userSolution: $userSolution)
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
export const AnnotationTextRecommendationDocument = gql`
    query AnnotationTextRecommendation($exerciseId: Int!, $username: String!, $userSolutionNodeId: Int!, $startIndex: Int!, $endIndex: Int!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userSolutionNodeId) {
        textRecommendations: annotationTextRecommendations(
          startIndex: $startIndex
          endIndex: $endIndex
        )
      }
    }
  }
}
    `;

/**
 * __useAnnotationTextRecommendationQuery__
 *
 * To run a query within a React component, call `useAnnotationTextRecommendationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAnnotationTextRecommendationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAnnotationTextRecommendationQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      userSolutionNodeId: // value for 'userSolutionNodeId'
 *      startIndex: // value for 'startIndex'
 *      endIndex: // value for 'endIndex'
 *   },
 * });
 */
export function useAnnotationTextRecommendationQuery(baseOptions: Apollo.QueryHookOptions<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables> & ({ variables: AnnotationTextRecommendationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>(AnnotationTextRecommendationDocument, options);
      }
export function useAnnotationTextRecommendationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>(AnnotationTextRecommendationDocument, options);
        }
export function useAnnotationTextRecommendationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>(AnnotationTextRecommendationDocument, options);
        }
export type AnnotationTextRecommendationQueryHookResult = ReturnType<typeof useAnnotationTextRecommendationQuery>;
export type AnnotationTextRecommendationLazyQueryHookResult = ReturnType<typeof useAnnotationTextRecommendationLazyQuery>;
export type AnnotationTextRecommendationSuspenseQueryHookResult = ReturnType<typeof useAnnotationTextRecommendationSuspenseQuery>;
export type AnnotationTextRecommendationQueryResult = Apollo.QueryResult<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>;
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
  changeRights(username: $username, newRights: $newRights)
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