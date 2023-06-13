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
  ID: { input: string | number; output: string; }
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

export enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['Int']['output'];
  sampleSolution: Array<FlatSampleSolutionNode>;
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userSolution: UserSolution;
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
  userSolution: UserSolutionMutations;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: UserSolutionInput;
};


export type ExerciseMutationsUserSolutionArgs = {
  username: Scalars['String']['input'];
};

export type FlatSampleSolutionNode = IFlatSolutionNode & {
  __typename?: 'FlatSampleSolutionNode';
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
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

export type FlatUserSolutionNode = IFlatSolutionNode & {
  __typename?: 'FlatUserSolutionNode';
  annotations: Array<Annotation>;
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type IFlatSolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSubText: Scalars['Boolean']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
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
  exerciseMutations: ExerciseMutations;
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

export type Query = {
  __typename?: 'Query';
  abbreviations: Array<Abbreviation>;
  exercise: Exercise;
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
  groupId: Scalars['Int']['output'];
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

export type SolutionIdentifier = {
  __typename?: 'SolutionIdentifier';
  correctionStatus?: Maybe<CorrectionStatus>;
  exerciseId: Scalars['Int']['output'];
  exerciseTitle: Scalars['String']['output'];
};

export type SolutionNodeMatch = {
  __typename?: 'SolutionNodeMatch';
  certainty?: Maybe<Scalars['Float']['output']>;
  exerciseId: Scalars['Int']['output'];
  matchStatus: MatchStatus;
  sampleValue: Scalars['Int']['output'];
  userValue: Scalars['Int']['output'];
  username: Scalars['String']['output'];
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
  nodes: Array<FlatUserSolutionNode>;
  username: Scalars['String']['output'];
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
  deleteAnnotation: Scalars['Int']['output'];
  deleteMatch: Scalars['Boolean']['output'];
  submitMatch: SolutionNodeMatch;
  upsertAnnotation: Annotation;
};


export type UserSolutionNodeDeleteAnnotationArgs = {
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

type IFlatSolutionNode_FlatSampleSolutionNode_Fragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

type IFlatSolutionNode_FlatUserSolutionNode_Fragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

export type IFlatSolutionNodeFragment = IFlatSolutionNode_FlatSampleSolutionNode_Fragment | IFlatSolutionNode_FlatUserSolutionNode_Fragment;

export type AnnotationFragment = { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string };

export type FlatUserSolutionNodeFragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> };

export type SolutionNodeMatchFragment = { __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null };

export type UserSolutionFragment = { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }>, correctionSummary?: { __typename?: 'CorrectionSummary', comment: string, points: number } | null };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type NewCorrectionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, userSolution: { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }>, correctionSummary?: { __typename?: 'CorrectionSummary', comment: string, points: number } | null } } };

export type SubmitNewMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type SubmitNewMatchMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', submitMatch: { __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null } } } } };

export type DeleteMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  sampleNodeId: Scalars['Int']['input'];
  userNodeId: Scalars['Int']['input'];
}>;


export type DeleteMatchMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', deleteMatch: boolean } } } };

export type UpsertAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  nodeId: Scalars['Int']['input'];
  maybeAnnotationId?: InputMaybe<Scalars['Int']['input']>;
  annotationInput: AnnotationInput;
}>;


export type UpsertAnnotationMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', upsertAnnotation: { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string } } } } };

export type UpsertCorrectionResultMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
}>;


export type UpsertCorrectionResultMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', updateCorrectionResult: { __typename?: 'CorrectionSummary', comment: string, points: number } } } };

export type DeleteAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  userSolutionNodeId: Scalars['Int']['input'];
  annotationId: Scalars['Int']['input'];
}>;


export type DeleteAnnotationMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', deleteAnnotation: number } } } };

export type CorrectionSummaryFragment = { __typename?: 'CorrectionSummary', comment: string, points: number };

export type UpsertCorrectionSummaryMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  comment: Scalars['String']['input'];
  points: Scalars['Int']['input'];
}>;


export type UpsertCorrectionSummaryMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', updateCorrectionResult: { __typename?: 'CorrectionSummary', comment: string, points: number } } } };

export type FinishCorrectionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type FinishCorrectionMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', finishCorrection: CorrectionStatus } } };

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


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string, userSolutions: Array<{ __typename?: 'UserSolution', username: string, correctionStatus: CorrectionStatus }> } };

export type InitiateCorrectionMutationVariables = Exact<{
  username: Scalars['String']['input'];
  exerciseId: Scalars['Int']['input'];
}>;


export type InitiateCorrectionMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', initiateCorrection: CorrectionStatus } } };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type ExerciseTaskDefinitionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string } };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
  userSolution: UserSolutionInput;
}>;


export type SubmitSolutionMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', submitSolution: boolean } };

export type ReviewDataFragment = { __typename?: 'ReviewData', comment: string, points: number, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }> };

export type CorrectionReviewQueryVariables = Exact<{
  exerciseId: Scalars['Int']['input'];
}>;


export type CorrectionReviewQuery = { __typename?: 'Query', reviewCorrection: { __typename?: 'ReviewData', comment: string, points: number, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }> } };

export type CorrectionReviewByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CorrectionReviewByUuidQuery = { __typename?: 'Query', reviewCorrectionByUuid?: { __typename?: 'ReviewData', comment: string, points: number, userSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }> } | null };

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

export const IFlatSolutionNodeFragmentDoc = gql`
    fragment IFlatSolutionNode on IFlatSolutionNode {
  id
  childIndex
  isSubText
  text
  applicability
  parentId
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
export const FlatUserSolutionNodeFragmentDoc = gql`
    fragment FlatUserSolutionNode on FlatUserSolutionNode {
  ...IFlatSolutionNode
  annotations {
    ...Annotation
  }
}
    ${IFlatSolutionNodeFragmentDoc}
${AnnotationFragmentDoc}`;
export const SolutionNodeMatchFragmentDoc = gql`
    fragment SolutionNodeMatch on SolutionNodeMatch {
  sampleValue
  userValue
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
    ...IFlatSolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
  comment
  points
}
    ${FlatUserSolutionNodeFragmentDoc}
${IFlatSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}`;
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
export const NewCorrectionDocument = gql`
    query NewCorrection($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    sampleSolution {
      ...IFlatSolutionNode
    }
    userSolution(username: $username) {
      ...UserSolution
    }
  }
}
    ${IFlatSolutionNodeFragmentDoc}
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
export type NewCorrectionQueryHookResult = ReturnType<typeof useNewCorrectionQuery>;
export type NewCorrectionLazyQueryHookResult = ReturnType<typeof useNewCorrectionLazyQuery>;
export type NewCorrectionQueryResult = Apollo.QueryResult<NewCorrectionQuery, NewCorrectionQueryVariables>;
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
export const UpsertCorrectionResultDocument = gql`
    mutation UpsertCorrectionResult($exerciseId: Int!, $username: String!, $comment: String!, $points: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      updateCorrectionResult(comment: $comment, points: $points) {
        comment
        points
      }
    }
  }
}
    `;
export type UpsertCorrectionResultMutationFn = Apollo.MutationFunction<UpsertCorrectionResultMutation, UpsertCorrectionResultMutationVariables>;

/**
 * __useUpsertCorrectionResultMutation__
 *
 * To run a mutation, you first call `useUpsertCorrectionResultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCorrectionResultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCorrectionResultMutation, { data, loading, error }] = useUpsertCorrectionResultMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      comment: // value for 'comment'
 *      points: // value for 'points'
 *   },
 * });
 */
export function useUpsertCorrectionResultMutation(baseOptions?: Apollo.MutationHookOptions<UpsertCorrectionResultMutation, UpsertCorrectionResultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertCorrectionResultMutation, UpsertCorrectionResultMutationVariables>(UpsertCorrectionResultDocument, options);
      }
export type UpsertCorrectionResultMutationHookResult = ReturnType<typeof useUpsertCorrectionResultMutation>;
export type UpsertCorrectionResultMutationResult = Apollo.MutationResult<UpsertCorrectionResultMutation>;
export type UpsertCorrectionResultMutationOptions = Apollo.BaseMutationOptions<UpsertCorrectionResultMutation, UpsertCorrectionResultMutationVariables>;
export const DeleteAnnotationDocument = gql`
    mutation DeleteAnnotation($exerciseId: Int!, $username: String!, $userSolutionNodeId: Int!, $annotationId: Int!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolution(username: $username) {
      node(userSolutionNodeId: $userSolutionNodeId) {
        deleteAnnotation(annotationId: $annotationId)
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
export type HomeQueryHookResult = ReturnType<typeof useHomeQuery>;
export type HomeLazyQueryHookResult = ReturnType<typeof useHomeLazyQuery>;
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
export type ExerciseOverviewQueryHookResult = ReturnType<typeof useExerciseOverviewQuery>;
export type ExerciseOverviewLazyQueryHookResult = ReturnType<typeof useExerciseOverviewLazyQuery>;
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
export type ExerciseTaskDefinitionQueryHookResult = ReturnType<typeof useExerciseTaskDefinitionQuery>;
export type ExerciseTaskDefinitionLazyQueryHookResult = ReturnType<typeof useExerciseTaskDefinitionLazyQuery>;
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
export function useCorrectionReviewQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectionReviewQuery, CorrectionReviewQueryVariables>(CorrectionReviewDocument, options);
      }
export function useCorrectionReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectionReviewQuery, CorrectionReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectionReviewQuery, CorrectionReviewQueryVariables>(CorrectionReviewDocument, options);
        }
export type CorrectionReviewQueryHookResult = ReturnType<typeof useCorrectionReviewQuery>;
export type CorrectionReviewLazyQueryHookResult = ReturnType<typeof useCorrectionReviewLazyQuery>;
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
export function useCorrectionReviewByUuidQuery(baseOptions: Apollo.QueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>(CorrectionReviewByUuidDocument, options);
      }
export function useCorrectionReviewByUuidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>(CorrectionReviewByUuidDocument, options);
        }
export type CorrectionReviewByUuidQueryHookResult = ReturnType<typeof useCorrectionReviewByUuidQuery>;
export type CorrectionReviewByUuidLazyQueryHookResult = ReturnType<typeof useCorrectionReviewByUuidLazyQuery>;
export type CorrectionReviewByUuidQueryResult = Apollo.QueryResult<CorrectionReviewByUuidQuery, CorrectionReviewByUuidQueryVariables>;
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
export type ManageRelatedWordsQueryHookResult = ReturnType<typeof useManageRelatedWordsQuery>;
export type ManageRelatedWordsLazyQueryHookResult = ReturnType<typeof useManageRelatedWordsLazyQuery>;
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
export type AbbreviationManagementQueryHookResult = ReturnType<typeof useAbbreviationManagementQuery>;
export type AbbreviationManagementLazyQueryHookResult = ReturnType<typeof useAbbreviationManagementLazyQuery>;
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
export type UserManagementQueryHookResult = ReturnType<typeof useUserManagementQuery>;
export type UserManagementLazyQueryHookResult = ReturnType<typeof useUserManagementLazyQuery>;
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