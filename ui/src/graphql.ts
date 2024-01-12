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
  __typename?: 'Abbreviation';
  abbreviation: Scalars['String']['output'];
  word: Scalars['String']['output'];
};

export type AbbreviationInput = {
  abbreviation: Scalars['String']['input'];
  word: Scalars['String']['input'];
};

export type AbbreviationMutations = {
  __typename?: 'AbbreviationMutations';
  delete: Scalars['Boolean']['output'];
  edit: Abbreviation;
};


export type AbbreviationMutationsEditArgs = {
  abbreviationInput: AbbreviationInput;
};

export type Annotation = {
  __typename?: 'Annotation';
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
  __typename?: 'AnnotationMutations';
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

export enum CorrectionStatus {
  Finished = 'Finished',
  Ongoing = 'Ongoing',
  Waiting = 'Waiting'
}

export type CorrectionSummary = {
  __typename?: 'CorrectionSummary';
  comment: Scalars['String']['output'];
  points: Scalars['Int']['output'];
};

export type DefaultSolutionNodeMatch = ISolutionNodeMatch & {
  __typename?: 'DefaultSolutionNodeMatch';
  certainty?: Maybe<Scalars['Float']['output']>;
  maybeExplanation?: Maybe<SolutionNodeMatchExplanation>;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['Int']['output'];
  sampleSolutionNodes: Array<FlatSampleSolutionNode>;
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
  __typename?: 'ExerciseMutations';
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
  __typename?: 'FlatSampleSolutionNode';
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  subTextNodes: Array<SampleSubTextNode>;
  text: Scalars['String']['output'];
};

export type FlatSolutionNodeInput = {
  applicability: Applicability;
  childIndex: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  text: Scalars['String']['input'];
};

export type FlatUserSolutionNode = SolutionNode & {
  __typename?: 'FlatUserSolutionNode';
  annotationTextRecommendations: Array<Scalars['String']['output']>;
  annotations: Array<Annotation>;
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  subTextNodes: Array<UserSubTextNode>;
  subTexts: Array<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};


export type FlatUserSolutionNodeAnnotationTextRecommendationsArgs = {
  endIndex: Scalars['Int']['input'];
  startIndex: Scalars['Int']['input'];
};

export type ISolutionNodeMatch = {
  certainty?: Maybe<Scalars['Float']['output']>;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export enum MatchStatus {
  Automatic = 'Automatic',
  Deleted = 'Deleted',
  Manual = 'Manual'
}

export type Mutation = {
  __typename?: 'Mutation';
  abbreviation?: Maybe<AbbreviationMutations>;
  changePassword: Scalars['Boolean']['output'];
  changeRights: Rights;
  claimJwt?: Maybe<Scalars['String']['output']>;
  createEmptyRelatedWordsGroup: Scalars['Int']['output'];
  createExercise: Scalars['Int']['output'];
  exerciseMutations?: Maybe<ExerciseMutations>;
  login: Scalars['String']['output'];
  register: Scalars['String']['output'];
  relatedWordsGroup?: Maybe<RelatedWordGroupMutations>;
  submitNewAbbreviation: Abbreviation;
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

export type ParagraphCitation = {
  __typename?: 'ParagraphCitation';
  lawCode: Scalars['String']['output'];
  paragraphNumber: Scalars['Int']['output'];
  paragraphType: Scalars['String']['output'];
  rest: Scalars['String']['output'];
  section?: Maybe<Scalars['Int']['output']>;
};

export type ParagraphCitationLocation = {
  __typename?: 'ParagraphCitationLocation';
  citedParagraphs: Array<ParagraphCitation>;
  from: Scalars['Int']['output'];
  to: Scalars['Int']['output'];
};

export type ParagraphCitationMatchExplanation = {
  __typename?: 'ParagraphCitationMatchExplanation';
  paragraphTypeEqual: Scalars['Boolean']['output'];
};

export type ParagraphMatch = {
  __typename?: 'ParagraphMatch';
  maybeExplanation?: Maybe<ParagraphCitationMatchExplanation>;
  sampleValue: ParagraphCitation;
  userValue: ParagraphCitation;
};

export type ParagraphMatchingResult = {
  __typename?: 'ParagraphMatchingResult';
  matches: Array<ParagraphMatch>;
  notMatchedSample: Array<ParagraphCitation>;
  notMatchedUser: Array<ParagraphCitation>;
};

export type Query = {
  __typename?: 'Query';
  abbreviations: Array<Abbreviation>;
  exercise?: Maybe<Exercise>;
  exercises: Array<Exercise>;
  mySolutions: Array<SolutionIdentifier>;
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
  __typename?: 'RelatedWord';
  isPositive: Scalars['Boolean']['output'];
  word: Scalars['String']['output'];
};

export type RelatedWordGroupMutations = {
  __typename?: 'RelatedWordGroupMutations';
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
  __typename?: 'RelatedWordMutations';
  delete: Scalars['Boolean']['output'];
  edit: RelatedWord;
};


export type RelatedWordMutationsEditArgs = {
  relatedWordInput: RelatedWordInput;
};

export type RelatedWordsGroup = {
  __typename?: 'RelatedWordsGroup';
  content: Array<RelatedWord>;
  groupId: Scalars['Int']['output'];
};

export type ReviewData = {
  __typename?: 'ReviewData';
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

export type SampleSubTextNode = SubTextNode & {
  __typename?: 'SampleSubTextNode';
  applicability: Applicability;
  text: Scalars['String']['output'];
};

export type SolutionIdentifier = {
  __typename?: 'SolutionIdentifier';
  correctionStatus?: Maybe<CorrectionStatus>;
  exerciseId: Scalars['Int']['output'];
  exerciseTitle: Scalars['String']['output'];
};

export type SolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  paragraphCitationLocations: Array<ParagraphCitationLocation>;
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type SolutionNodeMatch = ISolutionNodeMatch & {
  __typename?: 'SolutionNodeMatch';
  certainty?: Maybe<Scalars['Float']['output']>;
  matchStatus: MatchStatus;
  sampleNodeId: Scalars['Int']['output'];
  userNodeId: Scalars['Int']['output'];
};

export type SolutionNodeMatchExplanation = {
  __typename?: 'SolutionNodeMatchExplanation';
  maybePararaphMatchingResult?: Maybe<ParagraphMatchingResult>;
  wordMatchingResult: WordMatchingResult;
};

export type SubTextNode = {
  applicability: Applicability;
  text: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  rights: Rights;
  username: Scalars['String']['output'];
};

export type UserSolution = {
  __typename?: 'UserSolution';
  correctionStatus: CorrectionStatus;
  correctionSummary?: Maybe<CorrectionSummary>;
  matches: Array<SolutionNodeMatch>;
  node?: Maybe<FlatUserSolutionNode>;
  nodes: Array<FlatUserSolutionNode>;
  onlyParagraphMatchingCorrection: Array<DefaultSolutionNodeMatch>;
  performCurrentCorrection: Array<DefaultSolutionNodeMatch>;
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
  __typename?: 'UserSolutionMutations';
  finishCorrection: CorrectionStatus;
  initiateCorrection: CorrectionStatus;
  node: UserSolutionNode;
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
  __typename?: 'UserSolutionNode';
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

export type UserSubTextNode = SubTextNode & {
  __typename?: 'UserSubTextNode';
  annotations: Array<Annotation>;
  applicability: Applicability;
  text: Scalars['String']['output'];
};

export type WordMatch = {
  __typename?: 'WordMatch';
  maybeExplanation?: Maybe<WordMatchExplanation>;
  sampleValue: WordWithRelatedWords;
  userValue: WordWithRelatedWords;
};

export type WordMatchExplanation = {
  __typename?: 'WordMatchExplanation';
  distance: Scalars['Int']['output'];
  maxLength: Scalars['Int']['output'];
};

export type WordMatchingResult = {
  __typename?: 'WordMatchingResult';
  matches: Array<WordMatch>;
  notMatchedSample: Array<WordWithRelatedWords>;
  notMatchedUser: Array<WordWithRelatedWords>;
};

export type WordWithRelatedWords = {
  __typename?: 'WordWithRelatedWords';
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


export type SubmitNewMatchMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', submitMatch: { __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null } } } | null } | null };

export type DeleteMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type DeleteMatchMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', deleteMatch: boolean } } | null } | null };

export type UpsertAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  nodeId: Scalars['Int']['input'];
  maybeAnnotationId?: InputMaybe<Scalars['Int']['input']>;
  annotationInput: AnnotationInput;
}>;


export type UpsertAnnotationMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', upsertAnnotation: { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string } } } | null } | null };

export type DeleteAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  userSolutionNodeId: Scalars['Int']['input'];
  annotationId: Scalars['Int']['input'];
}>;


export type DeleteAnnotationMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', annotation?: { __typename?: 'AnnotationMutations', delete: number } | null } } | null } | null };

export type UpsertCorrectionSummaryMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
}>;


export type UpsertCorrectionSummaryMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', updateCorrectionResult: { __typename?: 'CorrectionSummary', comment: string, points: number } } | null } | null };

export type FinishCorrectionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type FinishCorrectionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', finishCorrection: CorrectionStatus } | null } | null };

type SubTextNode_SampleSubTextNode_Fragment = { __typename?: 'SampleSubTextNode', text: string, applicability: Applicability };

type SubTextNode_UserSubTextNode_Fragment = { __typename?: 'UserSubTextNode', text: string, applicability: Applicability };

export type SubTextNodeFragment = SubTextNode_SampleSubTextNode_Fragment | SubTextNode_UserSubTextNode_Fragment;

export type FlatSampleSolutionNodeFragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> };

export type AnnotationFragment = { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string };

export type UserSubTextNodeFragment = { __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> };

export type FlatUserSolutionNodeFragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> };

export type CorrectionSummaryFragment = { __typename?: 'CorrectionSummary', comment: string, points: number };

export type UserSolutionFragment = { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }>, correctionSummary?: { __typename?: 'CorrectionSummary', comment: string, points: number } | null };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type NewCorrectionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, userSolution?: { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }>, correctionSummary?: { __typename?: 'CorrectionSummary', comment: string, points: number } | null } | null } | null };

export type ReviewDataFragment = { __typename?: 'ReviewData', comment: string, points: number, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }> };

export type CorrectionReviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type CorrectionReviewQuery = { __typename?: 'Query', reviewCorrection: { __typename?: 'ReviewData', comment: string, points: number, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }> } };

export type AnnotationTextRecommendationQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  userSolutionNodeId: Scalars['Int']['input'];
  startIndex: Scalars['Int']['input'];
  endIndex: Scalars['Int']['input'];
}>;


export type AnnotationTextRecommendationQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', userSolution?: { __typename?: 'UserSolution', node?: { __typename?: 'FlatUserSolutionNode', textRecommendations: Array<string> } | null } | null } | null };

export type CorrectionReviewByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CorrectionReviewByUuidQuery = { __typename?: 'Query', reviewCorrectionByUuid?: { __typename?: 'ReviewData', comment: string, points: number, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }> } | null };

export type MatchingReviewExerciseDataFragment = { __typename?: 'Exercise', title: string, sampleSolutionNodes: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, usernames: Array<{ __typename?: 'UserSolution', username: string }> };

export type MatchingReviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type MatchingReviewQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, sampleSolutionNodes: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'SampleSubTextNode', text: string, applicability: Applicability }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, usernames: Array<{ __typename?: 'UserSolution', username: string }> } | null };

export type WordWithRelatedWordsFragment = { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> };

export type SolNodeMatchExplanationFragment = { __typename?: 'SolutionNodeMatchExplanation', wordMatchingResult: { __typename?: 'WordMatchingResult', matches: Array<{ __typename?: 'WordMatch', sampleValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, userValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, maybeExplanation?: { __typename: 'WordMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }>, notMatchedUser: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }> }, maybePararaphMatchingResult?: { __typename?: 'ParagraphMatchingResult', matches: Array<{ __typename?: 'ParagraphMatch', sampleValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, userValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, maybeExplanation?: { __typename: 'ParagraphCitationMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }>, notMatchedUser: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> } | null };

export type CurrentMatchFragment = { __typename?: 'DefaultSolutionNodeMatch', sampleNodeId: number, userNodeId: number, certainty?: number | null, maybeExplanation?: { __typename?: 'SolutionNodeMatchExplanation', wordMatchingResult: { __typename?: 'WordMatchingResult', matches: Array<{ __typename?: 'WordMatch', sampleValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, userValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, maybeExplanation?: { __typename: 'WordMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }>, notMatchedUser: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }> }, maybePararaphMatchingResult?: { __typename?: 'ParagraphMatchingResult', matches: Array<{ __typename?: 'ParagraphMatch', sampleValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, userValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, maybeExplanation?: { __typename: 'ParagraphCitationMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }>, notMatchedUser: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> } | null } | null };

export type MatchingReviewUserSolutionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type MatchingReviewUserSolutionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', userSolution?: { __typename?: 'UserSolution', userSolutionNodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, goldStandardMatches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }>, matches: Array<{ __typename?: 'DefaultSolutionNodeMatch', sampleNodeId: number, userNodeId: number, certainty?: number | null, maybeExplanation?: { __typename?: 'SolutionNodeMatchExplanation', wordMatchingResult: { __typename?: 'WordMatchingResult', matches: Array<{ __typename?: 'WordMatch', sampleValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, userValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, maybeExplanation?: { __typename: 'WordMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }>, notMatchedUser: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }> }, maybePararaphMatchingResult?: { __typename?: 'ParagraphMatchingResult', matches: Array<{ __typename?: 'ParagraphMatch', sampleValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, userValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, maybeExplanation?: { __typename: 'ParagraphCitationMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }>, notMatchedUser: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> } | null } | null }> } | null } | null };

export type ParagraphMatchingReviewUserSolutionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type ParagraphMatchingReviewUserSolutionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', userSolution?: { __typename?: 'UserSolution', userSolutionNodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTextNodes: Array<{ __typename?: 'UserSubTextNode', text: string, applicability: Applicability, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }>, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> }>, goldStandardMatches: Array<{ __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null }>, matches: Array<{ __typename?: 'DefaultSolutionNodeMatch', sampleNodeId: number, userNodeId: number, certainty?: number | null, maybeExplanation?: { __typename?: 'SolutionNodeMatchExplanation', wordMatchingResult: { __typename?: 'WordMatchingResult', matches: Array<{ __typename?: 'WordMatch', sampleValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, userValue: { __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }, maybeExplanation?: { __typename: 'WordMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }>, notMatchedUser: Array<{ __typename?: 'WordWithRelatedWords', word: string, synonyms: Array<string>, antonyms: Array<string> }> }, maybePararaphMatchingResult?: { __typename?: 'ParagraphMatchingResult', matches: Array<{ __typename?: 'ParagraphMatch', sampleValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, userValue: { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }, maybeExplanation?: { __typename: 'ParagraphCitationMatchExplanation' } | null }>, notMatchedSample: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }>, notMatchedUser: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> } | null } | null }> } | null } | null };

export type SolutionIdentifierFragment = { __typename?: 'SolutionIdentifier', exerciseId: number, exerciseTitle: string, correctionStatus?: CorrectionStatus | null };

export type ExerciseIdentifierFragment = { __typename?: 'Exercise', id: number, title: string };

export type HomeQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'Exercise', id: number, title: string }>, mySolutions: Array<{ __typename?: 'SolutionIdentifier', exerciseId: number, exerciseTitle: string, correctionStatus?: CorrectionStatus | null }> };

export type CreateExerciseMutationVariables = Exact<{
  exerciseInput: ExerciseInput;
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise: number };

export type ExerciseOverviewFragment = { __typename?: 'Exercise', title: string, text: string, userSolutions: Array<{ __typename?: 'UserSolution', username: string, correctionStatus: CorrectionStatus }> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string, userSolutions: Array<{ __typename?: 'UserSolution', username: string, correctionStatus: CorrectionStatus }> } | null };

export type InitiateCorrectionMutationVariables = Exact<{
  username: Scalars['String']['input'];
  exerciseId: Scalars['Int']['input'];
}>;


export type InitiateCorrectionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolution?: { __typename?: 'UserSolutionMutations', initiateCorrection: CorrectionStatus } | null } | null };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseTaskDefinitionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string } | null };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  userSolution: UserSolutionInput;
}>;


export type SubmitSolutionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitSolution: boolean } | null };

export type RelatedWordFragment = { __typename?: 'RelatedWord', word: string, isPositive: boolean };

export type RelatedWordsGroupFragment = { __typename?: 'RelatedWordsGroup', groupId: number, content: Array<{ __typename?: 'RelatedWord', word: string, isPositive: boolean }> };

export type ManageRelatedWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type ManageRelatedWordsQuery = { __typename?: 'Query', relatedWordGroups: Array<{ __typename?: 'RelatedWordsGroup', groupId: number, content: Array<{ __typename?: 'RelatedWord', word: string, isPositive: boolean }> }> };

export type CreateEmptyRelatedWordsGroupMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEmptyRelatedWordsGroupMutation = { __typename?: 'Mutation', groupId: number };

export type DeleteRelatedWordsGroupMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type DeleteRelatedWordsGroupMutation = { __typename?: 'Mutation', relatedWordsGroup?: { __typename?: 'RelatedWordGroupMutations', delete: boolean } | null };

export type SubmitRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  relatedWordInput: RelatedWordInput;
}>;


export type SubmitRelatedWordMutation = { __typename?: 'Mutation', relatedWordsGroup?: { __typename?: 'RelatedWordGroupMutations', submitRelatedWord: { __typename?: 'RelatedWord', word: string, isPositive: boolean } } | null };

export type EditRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  originalWord: Scalars['String']['input'];
  relatedWordInput: RelatedWordInput;
}>;


export type EditRelatedWordMutation = { __typename?: 'Mutation', relatedWordsGroup?: { __typename?: 'RelatedWordGroupMutations', relatedWord?: { __typename?: 'RelatedWordMutations', edit: { __typename?: 'RelatedWord', word: string, isPositive: boolean } } | null } | null };

export type DeleteRelatedWordMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
  word: Scalars['String']['input'];
}>;


export type DeleteRelatedWordMutation = { __typename?: 'Mutation', relatedWordsGroup?: { __typename?: 'RelatedWordGroupMutations', relatedWord?: { __typename?: 'RelatedWordMutations', delete: boolean } | null } | null };

export type AbbreviationFragment = { __typename?: 'Abbreviation', abbreviation: string, word: string };

export type AbbreviationManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type AbbreviationManagementQuery = { __typename?: 'Query', abbreviations: Array<{ __typename?: 'Abbreviation', abbreviation: string, word: string }> };

export type SubmitAbbreviationMutationVariables = Exact<{
  abbreviationInput: AbbreviationInput;
}>;


export type SubmitAbbreviationMutation = { __typename?: 'Mutation', newAbbreviation: { __typename?: 'Abbreviation', abbreviation: string, word: string } };

export type DeleteAbbreviationMutationVariables = Exact<{
  abbreviation: Scalars['String']['input'];
}>;


export type DeleteAbbreviationMutation = { __typename?: 'Mutation', abbreviation?: { __typename?: 'AbbreviationMutations', delete: boolean } | null };

export type UpdateAbbreviationMutationVariables = Exact<{
  abbreviation: Scalars['String']['input'];
  abbreviationInput: AbbreviationInput;
}>;


export type UpdateAbbreviationMutation = { __typename?: 'Mutation', abbreviation?: { __typename?: 'AbbreviationMutations', edit: { __typename?: 'Abbreviation', abbreviation: string, word: string } } | null };

export type ParagraphCitationFragment = { __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string };

export type ParagraphCitationLocationFragment = { __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> };

type SolutionNode_FlatSampleSolutionNode_Fragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> };

type SolutionNode_FlatUserSolutionNode_Fragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, paragraphCitationLocations: Array<{ __typename?: 'ParagraphCitationLocation', from: number, to: number, citedParagraphs: Array<{ __typename?: 'ParagraphCitation', paragraphType: string, paragraphNumber: number, section?: number | null, rest: string, lawCode: string }> }> };

export type SolutionNodeFragment = SolutionNode_FlatSampleSolutionNode_Fragment | SolutionNode_FlatUserSolutionNode_Fragment;

type ISolutionNodeMatch_DefaultSolutionNodeMatch_Fragment = { __typename?: 'DefaultSolutionNodeMatch', sampleNodeId: number, userNodeId: number, certainty?: number | null };

type ISolutionNodeMatch_SolutionNodeMatch_Fragment = { __typename?: 'SolutionNodeMatch', sampleNodeId: number, userNodeId: number, certainty?: number | null };

export type ISolutionNodeMatchFragment = ISolutionNodeMatch_DefaultSolutionNodeMatch_Fragment | ISolutionNodeMatch_SolutionNodeMatch_Fragment;

export type SolutionNodeMatchFragment = { __typename?: 'SolutionNodeMatch', matchStatus: MatchStatus, sampleNodeId: number, userNodeId: number, certainty?: number | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type ClaimJwtMutationVariables = Exact<{
  ltiUuid: Scalars['String']['input'];
}>;


export type ClaimJwtMutation = { __typename?: 'Mutation', claimJwt?: string | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordRepeat: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type UserFragment = { __typename?: 'User', username: string, rights: Rights };

export type UserManagementQueryVariables = Exact<{ [key: string]: never; }>;


export type UserManagementQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', username: string, rights: Rights }> };

export type ChangeRightsMutationVariables = Exact<{
  username: Scalars['String']['input'];
  newRights: Rights;
}>;


export type ChangeRightsMutation = { __typename?: 'Mutation', changeRights: Rights };

export const ParagraphCitationFragmentDoc = gql`
    fragment ParagraphCitation on ParagraphCitation {
  paragraphType
  paragraphNumber
  section
  rest
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
}
    ${ParagraphCitationFragmentDoc}`;
export const SolutionNodeFragmentDoc = gql`
    fragment SolutionNode on SolutionNode {
  id
  childIndex
  text
  applicability
  parentId
  paragraphCitationLocations {
    ...ParagraphCitationLocation
  }
}
    ${ParagraphCitationLocationFragmentDoc}`;
export const SubTextNodeFragmentDoc = gql`
    fragment SubTextNode on SubTextNode {
  text
  applicability
}
    `;
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
export const UserSubTextNodeFragmentDoc = gql`
    fragment UserSubTextNode on UserSubTextNode {
  ...SubTextNode
  annotations {
    ...Annotation
  }
}
    ${SubTextNodeFragmentDoc}
${AnnotationFragmentDoc}`;
export const FlatUserSolutionNodeFragmentDoc = gql`
    fragment FlatUserSolutionNode on FlatUserSolutionNode {
  ...SolutionNode
  subTextNodes {
    ...UserSubTextNode
  }
  annotations {
    ...Annotation
  }
}
    ${SolutionNodeFragmentDoc}
${UserSubTextNodeFragmentDoc}
${AnnotationFragmentDoc}`;
export const ISolutionNodeMatchFragmentDoc = gql`
    fragment ISolutionNodeMatch on ISolutionNodeMatch {
  sampleNodeId
  userNodeId
  certainty
}
    `;
export const SolutionNodeMatchFragmentDoc = gql`
    fragment SolutionNodeMatch on SolutionNodeMatch {
  ...ISolutionNodeMatch
  matchStatus
}
    ${ISolutionNodeMatchFragmentDoc}`;
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
export const FlatSampleSolutionNodeFragmentDoc = gql`
    fragment FlatSampleSolutionNode on FlatSampleSolutionNode {
  ...SolutionNode
  subTextNodes {
    ...SubTextNode
  }
}
    ${SolutionNodeFragmentDoc}
${SubTextNodeFragmentDoc}`;
export const ReviewDataFragmentDoc = gql`
    fragment ReviewData on ReviewData {
  sampleSolution {
    ...FlatSampleSolutionNode
  }
  userSolution {
    ...FlatUserSolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
  comment
  points
}
    ${FlatSampleSolutionNodeFragmentDoc}
${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}`;
export const MatchingReviewExerciseDataFragmentDoc = gql`
    fragment MatchingReviewExerciseData on Exercise {
  title
  sampleSolutionNodes {
    ...FlatSampleSolutionNode
  }
  usernames: userSolutions {
    username
  }
}
    ${FlatSampleSolutionNodeFragmentDoc}`;
export const WordWithRelatedWordsFragmentDoc = gql`
    fragment WordWithRelatedWords on WordWithRelatedWords {
  word
  synonyms
  antonyms
}
    `;
export const SolNodeMatchExplanationFragmentDoc = gql`
    fragment SolNodeMatchExplanation on SolutionNodeMatchExplanation {
  wordMatchingResult {
    matches {
      sampleValue {
        ...WordWithRelatedWords
      }
      userValue {
        ...WordWithRelatedWords
      }
      maybeExplanation {
        __typename
      }
    }
    notMatchedSample {
      ...WordWithRelatedWords
    }
    notMatchedUser {
      ...WordWithRelatedWords
    }
  }
  maybePararaphMatchingResult {
    matches {
      sampleValue {
        ...ParagraphCitation
      }
      userValue {
        ...ParagraphCitation
      }
      maybeExplanation {
        __typename
      }
    }
    notMatchedSample {
      ...ParagraphCitation
    }
    notMatchedUser {
      ...ParagraphCitation
    }
  }
}
    ${WordWithRelatedWordsFragmentDoc}
${ParagraphCitationFragmentDoc}`;
export const CurrentMatchFragmentDoc = gql`
    fragment CurrentMatch on DefaultSolutionNodeMatch {
  ...ISolutionNodeMatch
  maybeExplanation {
    ...SolNodeMatchExplanation
  }
}
    ${ISolutionNodeMatchFragmentDoc}
${SolNodeMatchExplanationFragmentDoc}`;
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
export const AbbreviationFragmentDoc = gql`
    fragment Abbreviation on Abbreviation {
  abbreviation
  word
}
    `;
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
    sampleSolution: sampleSolutionNodes {
      ...FlatSampleSolutionNode
    }
    userSolution(username: $username) {
      ...UserSolution
    }
  }
}
    ${FlatSampleSolutionNodeFragmentDoc}
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
export function useNewCorrectionQuery(baseOptions: Apollo.QueryHookOptions<NewCorrectionQuery, NewCorrectionQueryVariables>) {
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
export function useCorrectionReviewQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables>) {
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
export function useAnnotationTextRecommendationQuery(baseOptions: Apollo.QueryHookOptions<AnnotationTextRecommendationQuery, AnnotationTextRecommendationQueryVariables>) {
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
export function useCorrectionReviewByUuidQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>) {
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
export const MatchingReviewDocument = gql`
    query MatchingReview($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    ...MatchingReviewExerciseData
  }
}
    ${MatchingReviewExerciseDataFragmentDoc}`;

/**
 * __useMatchingReviewQuery__
 *
 * To run a query within a React component, call `useMatchingReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useMatchingReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchingReviewQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useMatchingReviewQuery(baseOptions: Apollo.QueryHookOptions<MatchingReviewQuery, MatchingReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MatchingReviewQuery, MatchingReviewQueryVariables>(MatchingReviewDocument, options);
      }
export function useMatchingReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MatchingReviewQuery, MatchingReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MatchingReviewQuery, MatchingReviewQueryVariables>(MatchingReviewDocument, options);
        }
export function useMatchingReviewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MatchingReviewQuery, MatchingReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MatchingReviewQuery, MatchingReviewQueryVariables>(MatchingReviewDocument, options);
        }
export type MatchingReviewQueryHookResult = ReturnType<typeof useMatchingReviewQuery>;
export type MatchingReviewLazyQueryHookResult = ReturnType<typeof useMatchingReviewLazyQuery>;
export type MatchingReviewSuspenseQueryHookResult = ReturnType<typeof useMatchingReviewSuspenseQuery>;
export type MatchingReviewQueryResult = Apollo.QueryResult<MatchingReviewQuery, MatchingReviewQueryVariables>;
export const MatchingReviewUserSolutionDocument = gql`
    query MatchingReviewUserSolution($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      userSolutionNodes: nodes {
        ...FlatUserSolutionNode
      }
      goldStandardMatches: matches {
        ...SolutionNodeMatch
      }
      matches: performCurrentCorrection {
        ...CurrentMatch
      }
    }
  }
}
    ${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}
${CurrentMatchFragmentDoc}`;

/**
 * __useMatchingReviewUserSolutionQuery__
 *
 * To run a query within a React component, call `useMatchingReviewUserSolutionQuery` and pass it any options that fit your needs.
 * When your component renders, `useMatchingReviewUserSolutionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchingReviewUserSolutionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useMatchingReviewUserSolutionQuery(baseOptions: Apollo.QueryHookOptions<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>(MatchingReviewUserSolutionDocument, options);
      }
export function useMatchingReviewUserSolutionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>(MatchingReviewUserSolutionDocument, options);
        }
export function useMatchingReviewUserSolutionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>(MatchingReviewUserSolutionDocument, options);
        }
export type MatchingReviewUserSolutionQueryHookResult = ReturnType<typeof useMatchingReviewUserSolutionQuery>;
export type MatchingReviewUserSolutionLazyQueryHookResult = ReturnType<typeof useMatchingReviewUserSolutionLazyQuery>;
export type MatchingReviewUserSolutionSuspenseQueryHookResult = ReturnType<typeof useMatchingReviewUserSolutionSuspenseQuery>;
export type MatchingReviewUserSolutionQueryResult = Apollo.QueryResult<MatchingReviewUserSolutionQuery, MatchingReviewUserSolutionQueryVariables>;
export const ParagraphMatchingReviewUserSolutionDocument = gql`
    query ParagraphMatchingReviewUserSolution($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      userSolutionNodes: nodes {
        ...FlatUserSolutionNode
      }
      goldStandardMatches: matches {
        ...SolutionNodeMatch
      }
      matches: onlyParagraphMatchingCorrection {
        ...CurrentMatch
      }
    }
  }
}
    ${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}
${CurrentMatchFragmentDoc}`;

/**
 * __useParagraphMatchingReviewUserSolutionQuery__
 *
 * To run a query within a React component, call `useParagraphMatchingReviewUserSolutionQuery` and pass it any options that fit your needs.
 * When your component renders, `useParagraphMatchingReviewUserSolutionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParagraphMatchingReviewUserSolutionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useParagraphMatchingReviewUserSolutionQuery(baseOptions: Apollo.QueryHookOptions<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>(ParagraphMatchingReviewUserSolutionDocument, options);
      }
export function useParagraphMatchingReviewUserSolutionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>(ParagraphMatchingReviewUserSolutionDocument, options);
        }
export function useParagraphMatchingReviewUserSolutionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>(ParagraphMatchingReviewUserSolutionDocument, options);
        }
export type ParagraphMatchingReviewUserSolutionQueryHookResult = ReturnType<typeof useParagraphMatchingReviewUserSolutionQuery>;
export type ParagraphMatchingReviewUserSolutionLazyQueryHookResult = ReturnType<typeof useParagraphMatchingReviewUserSolutionLazyQuery>;
export type ParagraphMatchingReviewUserSolutionSuspenseQueryHookResult = ReturnType<typeof useParagraphMatchingReviewUserSolutionSuspenseQuery>;
export type ParagraphMatchingReviewUserSolutionQueryResult = Apollo.QueryResult<ParagraphMatchingReviewUserSolutionQuery, ParagraphMatchingReviewUserSolutionQueryVariables>;
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
export function useExerciseOverviewQuery(baseOptions: Apollo.QueryHookOptions<ExerciseOverviewQuery, ExerciseOverviewQueryVariables>) {
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
export function useExerciseTaskDefinitionQuery(baseOptions: Apollo.QueryHookOptions<ExerciseTaskDefinitionQuery, ExerciseTaskDefinitionQueryVariables>) {
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