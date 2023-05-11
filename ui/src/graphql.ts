import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Annotation = {
  __typename?: 'Annotation';
  endIndex: Scalars['Int'];
  errorType: ErrorType;
  id: Scalars['Int'];
  importance: AnnotationImportance;
  startIndex: Scalars['Int'];
  text: Scalars['String'];
};

export enum AnnotationImportance {
  Less = 'Less',
  Medium = 'Medium',
  More = 'More'
}

export type AnnotationInput = {
  endIndex: Scalars['Int'];
  errorType: ErrorType;
  importance: AnnotationImportance;
  startIndex: Scalars['Int'];
  text: Scalars['String'];
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

export enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['Int'];
  sampleSolution: Array<FlatSampleSolutionNode>;
  text: Scalars['String'];
  title: Scalars['String'];
  userSolution: UserSolution;
  userSolutions: Array<UserSolution>;
};


export type ExerciseUserSolutionArgs = {
  username: Scalars['String'];
};

export type ExerciseInput = {
  sampleSolution: Array<FlatSolutionNodeInput>;
  text: Scalars['String'];
  title: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  submitSolution: Scalars['Boolean'];
  userSolution: UserSolutionMutations;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: UserSolutionInput;
};


export type ExerciseMutationsUserSolutionArgs = {
  username: Scalars['String'];
};

export type FlatSampleSolutionNode = IFlatSolutionNode & {
  __typename?: 'FlatSampleSolutionNode';
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  isSubText: Scalars['Boolean'];
  parentId?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type FlatSolutionNodeInput = {
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  isSubText: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type FlatUserSolutionNode = IFlatSolutionNode & {
  __typename?: 'FlatUserSolutionNode';
  annotations: Array<Annotation>;
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  isSubText: Scalars['Boolean'];
  parentId?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type IFlatSolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  isSubText: Scalars['Boolean'];
  parentId?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
};

export enum MatchStatus {
  Automatic = 'Automatic',
  Confirmed = 'Confirmed',
  Manual = 'Manual'
}

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  claimJwt?: Maybe<Scalars['String']>;
  createExercise: Scalars['Int'];
  exerciseMutations: ExerciseMutations;
  login: Scalars['String'];
  register: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};


export type MutationClaimJwtArgs = {
  ltiUuid: Scalars['String'];
};


export type MutationCreateExerciseArgs = {
  exerciseInput: ExerciseInput;
};


export type MutationExerciseMutationsArgs = {
  exerciseId: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  exercise: Exercise;
  exercises: Array<Exercise>;
};


export type QueryExerciseArgs = {
  exerciseId: Scalars['Int'];
};

export enum Rights {
  Admin = 'Admin',
  Corrector = 'Corrector',
  Student = 'Student'
}

export type SolutionNodeMatch = {
  __typename?: 'SolutionNodeMatch';
  certainty?: Maybe<Scalars['Float']>;
  exerciseId: Scalars['Int'];
  matchStatus: MatchStatus;
  sampleValue: Scalars['Int'];
  userValue: Scalars['Int'];
  username: Scalars['String'];
};

export type UserSolution = {
  __typename?: 'UserSolution';
  correctionStatus: CorrectionStatus;
  matches: Array<SolutionNodeMatch>;
  nodes: Array<FlatUserSolutionNode>;
  username: Scalars['String'];
};

export type UserSolutionInput = {
  solution: Array<FlatSolutionNodeInput>;
  username: Scalars['String'];
};

export type UserSolutionMutations = {
  __typename?: 'UserSolutionMutations';
  initiateCorrection: CorrectionStatus;
  node: UserSolutionNode;
};


export type UserSolutionMutationsNodeArgs = {
  userSolutionNodeId: Scalars['Int'];
};

export type UserSolutionNode = {
  __typename?: 'UserSolutionNode';
  deleteAnnotation: Scalars['Int'];
  deleteMatch: Scalars['Boolean'];
  submitMatch: SolutionNodeMatch;
  upsertAnnotation: Annotation;
};


export type UserSolutionNodeDeleteAnnotationArgs = {
  annotationId: Scalars['Int'];
};


export type UserSolutionNodeDeleteMatchArgs = {
  sampleSolutionNodeId: Scalars['Int'];
};


export type UserSolutionNodeSubmitMatchArgs = {
  sampleSolutionNodeId: Scalars['Int'];
};


export type UserSolutionNodeUpsertAnnotationArgs = {
  annotation: AnnotationInput;
  maybeAnnotationId?: InputMaybe<Scalars['Int']>;
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type ClaimJwtMutationVariables = Exact<{
  ltiUuid: Scalars['String'];
}>;


export type ClaimJwtMutation = { __typename?: 'Mutation', claimJwt?: string | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type AllExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllExercisesQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'Exercise', id: number, title: string }> };

export type CreateExerciseMutationVariables = Exact<{
  exerciseInput: ExerciseInput;
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise: number };

export type ExerciseOverviewFragment = { __typename?: 'Exercise', title: string, text: string, userSolutions: Array<{ __typename?: 'UserSolution', username: string, correctionStatus: CorrectionStatus }> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string, userSolutions: Array<{ __typename?: 'UserSolution', username: string, correctionStatus: CorrectionStatus }> } };

export type InitiateCorrectionMutationVariables = Exact<{
  username: Scalars['String'];
  exerciseId: Scalars['Int'];
}>;


export type InitiateCorrectionMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', initiateCorrection: CorrectionStatus } } };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseTaskDefinitionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string } };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  userSolution: UserSolutionInput;
}>;


export type SubmitSolutionMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', submitSolution: boolean } };

type IFlatSolutionNode_FlatSampleSolutionNode_Fragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

type IFlatSolutionNode_FlatUserSolutionNode_Fragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

export type IFlatSolutionNodeFragment = IFlatSolutionNode_FlatSampleSolutionNode_Fragment | IFlatSolutionNode_FlatUserSolutionNode_Fragment;

export type AnnotationFragment = { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string };

export type FlatUserSolutionNodeFragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> };

export type SolutionNodeMatchFragment = { __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null };

export type UserSolutionFragment = { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }> };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type NewCorrectionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, userSolution: { __typename?: 'UserSolution', correctionStatus: CorrectionStatus, nodes: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string }> }>, matches: Array<{ __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null }> } } };

export type SubmitNewMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  sampleNodeId: Scalars['Int'];
  userNodeId: Scalars['Int'];
}>;


export type SubmitNewMatchMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', submitMatch: { __typename?: 'SolutionNodeMatch', sampleValue: number, userValue: number, matchStatus: MatchStatus, certainty?: number | null } } } } };

export type DeleteMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  sampleNodeId: Scalars['Int'];
  userNodeId: Scalars['Int'];
}>;


export type DeleteMatchMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', deleteMatch: boolean } } } };

export type UpsertAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  nodeId: Scalars['Int'];
  maybeAnnotationId?: InputMaybe<Scalars['Int']>;
  annotationInput: AnnotationInput;
}>;


export type UpsertAnnotationMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', upsertAnnotation: { __typename?: 'Annotation', id: number, errorType: ErrorType, importance: AnnotationImportance, startIndex: number, endIndex: number, text: string } } } } };

export type DeleteAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  userSolutionNodeId: Scalars['Int'];
  annotationId: Scalars['Int'];
}>;


export type DeleteAnnotationMutation = { __typename?: 'Mutation', exerciseMutations: { __typename?: 'ExerciseMutations', userSolution: { __typename?: 'UserSolutionMutations', node: { __typename?: 'UserSolutionNode', deleteAnnotation: number } } } };

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
export const UserSolutionFragmentDoc = gql`
    fragment UserSolution on UserSolution {
  correctionStatus
  nodes {
    ...FlatUserSolutionNode
  }
  matches {
    ...SolutionNodeMatch
  }
}
    ${FlatUserSolutionNodeFragmentDoc}
${SolutionNodeMatchFragmentDoc}`;
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
export const AllExercisesDocument = gql`
    query AllExercises {
  exercises {
    id
    title
  }
}
    `;

/**
 * __useAllExercisesQuery__
 *
 * To run a query within a React component, call `useAllExercisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllExercisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllExercisesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllExercisesQuery(baseOptions?: Apollo.QueryHookOptions<AllExercisesQuery, AllExercisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllExercisesQuery, AllExercisesQueryVariables>(AllExercisesDocument, options);
      }
export function useAllExercisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllExercisesQuery, AllExercisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllExercisesQuery, AllExercisesQueryVariables>(AllExercisesDocument, options);
        }
export type AllExercisesQueryHookResult = ReturnType<typeof useAllExercisesQuery>;
export type AllExercisesLazyQueryHookResult = ReturnType<typeof useAllExercisesLazyQuery>;
export type AllExercisesQueryResult = Apollo.QueryResult<AllExercisesQuery, AllExercisesQueryVariables>;
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