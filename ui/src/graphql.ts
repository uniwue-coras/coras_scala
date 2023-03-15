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
  startIndex: Scalars['Int'];
  text: Scalars['String'];
};

export type AnnotationInput = {
  endIndex: Scalars['Int'];
  errorType: ErrorType;
  startIndex: Scalars['Int'];
  text: Scalars['String'];
};

export enum Applicability {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable',
  NotSpecified = 'NotSpecified'
}

export enum ErrorType {
  Missing = 'Missing',
  Wrong = 'Wrong'
}

export type Exercise = {
  __typename?: 'Exercise';
  allUsersWithCorrection: Array<Scalars['String']>;
  allUsersWithSolution: Array<Scalars['String']>;
  corrected: Scalars['Boolean'];
  flatCorrectionForUser: Array<NodeIdMatch>;
  flatSampleSolution: Array<FlatSampleSolutionNode>;
  flatUserSolution: Array<FlatUserSolutionNode>;
  id: Scalars['Int'];
  solutionSubmitted: Scalars['Boolean'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type ExerciseFlatCorrectionForUserArgs = {
  username: Scalars['String'];
};


export type ExerciseFlatUserSolutionArgs = {
  username: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  submitCorrection: Scalars['Boolean'];
  submitSolution: Scalars['Boolean'];
  userSolutionNode?: Maybe<UserSolutionNode>;
};


export type ExerciseMutationsSubmitCorrectionArgs = {
  correctionInput: GraphQlCorrectionInput;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: GraphQlUserSolutionInput;
};


export type ExerciseMutationsUserSolutionNodeArgs = {
  userSolutionNodeId: Scalars['Int'];
  username: Scalars['String'];
};

export type ExtractedWord = {
  __typename?: 'ExtractedWord';
  index: Scalars['Int'];
  word: Scalars['String'];
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

export type GraphQlCorrectionInput = {
  correctionAsJson: Scalars['String'];
  username: Scalars['String'];
};

export type GraphQlExerciseInput = {
  sampleSolution: Array<FlatSolutionNodeInput>;
  text: Scalars['String'];
  title: Scalars['String'];
};

export type GraphQlUserSolutionInput = {
  maybeUsername?: InputMaybe<Scalars['String']>;
  solution: Array<FlatSolutionNodeInput>;
};

export type IFlatSolutionNode = {
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  isSubText: Scalars['Boolean'];
  parentId?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type Match = {
  __typename?: 'Match';
  sampleValue: ExtractedWord;
  userValue: ExtractedWord;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  claimJwt?: Maybe<Scalars['String']>;
  createExercise: Scalars['Int'];
  exerciseMutations?: Maybe<ExerciseMutations>;
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
  exerciseInput: GraphQlExerciseInput;
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

export type NodeIdMatch = {
  __typename?: 'NodeIdMatch';
  explanation?: Maybe<NounMatchingResult>;
  sampleValue: Scalars['Int'];
  userValue: Scalars['Int'];
};

export type NounMatchingResult = {
  __typename?: 'NounMatchingResult';
  matches: Array<Match>;
  notMatchedSample: Array<ExtractedWord>;
  notMatchedUser: Array<ExtractedWord>;
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

export type UserSolutionNode = {
  __typename?: 'UserSolutionNode';
  deleteAnnotation: Scalars['Int'];
  submitAnnotation: Annotation;
  updateAnnotation: Annotation;
};


export type UserSolutionNodeDeleteAnnotationArgs = {
  annotationId: Scalars['Int'];
};


export type UserSolutionNodeSubmitAnnotationArgs = {
  annotation: AnnotationInput;
};


export type UserSolutionNodeUpdateAnnotationArgs = {
  annotation: AnnotationInput;
  annotationId: Scalars['Int'];
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
  exerciseInput: GraphQlExerciseInput;
}>;


export type CreateExerciseMutation = { __typename?: 'Mutation', createExercise: number };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string>, corrected: boolean, allUsersWithCorrection: Array<string> } };

export type ExerciseOverviewFragment = { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string>, corrected: boolean, allUsersWithCorrection: Array<string> };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseTaskDefinitionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string } };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  userSolution: GraphQlUserSolutionInput;
}>;


export type SubmitSolutionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitSolution: boolean } | null };

export type AnnotationFragment = { __typename?: 'Annotation', id: number, errorType: ErrorType, startIndex: number, endIndex: number, text: string };

export type SubmitAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  userSolutionNodeId: Scalars['Int'];
  annotationInput: AnnotationInput;
}>;


export type SubmitAnnotationMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolutionNode?: { __typename?: 'UserSolutionNode', submitAnnotation: { __typename?: 'Annotation', id: number, errorType: ErrorType, startIndex: number, endIndex: number, text: string } } | null } | null };

export type UpdateAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  userSolutionNodeId: Scalars['Int'];
  annotationId: Scalars['Int'];
  annotationInput: AnnotationInput;
}>;


export type UpdateAnnotationMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolutionNode?: { __typename?: 'UserSolutionNode', updateAnnotation: { __typename?: 'Annotation', id: number, errorType: ErrorType, startIndex: number, endIndex: number, text: string } } | null } | null };

export type DeleteAnnotationMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  userSolutionNodeId: Scalars['Int'];
  annotationId: Scalars['Int'];
}>;


export type DeleteAnnotationMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', userSolutionNode?: { __typename?: 'UserSolutionNode', deleteAnnotation: number } | null } | null };

type IFlatSolutionNode_FlatSampleSolutionNode_Fragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

type IFlatSolutionNode_FlatUserSolutionNode_Fragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

export type IFlatSolutionNodeFragment = IFlatSolutionNode_FlatSampleSolutionNode_Fragment | IFlatSolutionNode_FlatUserSolutionNode_Fragment;

export type FlatSolutionNodeFragment = { __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null };

export type FlatUserSolutionNodeFragment = { __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, startIndex: number, endIndex: number, text: string }> };

export type ExtractedWordFragment = { __typename?: 'ExtractedWord', index: number, word: string };

export type NounMatchingResultFragment = { __typename?: 'NounMatchingResult', matches: Array<{ __typename?: 'Match', sampleValue: { __typename?: 'ExtractedWord', index: number, word: string }, userValue: { __typename?: 'ExtractedWord', index: number, word: string } }> };

export type NodeMatchFragment = { __typename?: 'NodeIdMatch', sampleValue: number, userValue: number, explanation?: { __typename?: 'NounMatchingResult', matches: Array<{ __typename?: 'Match', sampleValue: { __typename?: 'ExtractedWord', index: number, word: string }, userValue: { __typename?: 'ExtractedWord', index: number, word: string } }> } | null };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type NewCorrectionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', flatSampleSolution: Array<{ __typename?: 'FlatSampleSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null }>, flatUserSolution: Array<{ __typename?: 'FlatUserSolutionNode', id: number, childIndex: number, isSubText: boolean, text: string, applicability: Applicability, parentId?: number | null, annotations: Array<{ __typename?: 'Annotation', id: number, errorType: ErrorType, startIndex: number, endIndex: number, text: string }> }>, flatCorrectionForUser: Array<{ __typename?: 'NodeIdMatch', sampleValue: number, userValue: number, explanation?: { __typename?: 'NounMatchingResult', matches: Array<{ __typename?: 'Match', sampleValue: { __typename?: 'ExtractedWord', index: number, word: string }, userValue: { __typename?: 'ExtractedWord', index: number, word: string } }> } | null }> } };

export type SubmitCorrectionMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  correctionInput: GraphQlCorrectionInput;
}>;


export type SubmitCorrectionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitCorrection: boolean } | null };

export const ExerciseOverviewFragmentDoc = gql`
    fragment ExerciseOverview on Exercise {
  title
  text
  solutionSubmitted
  allUsersWithSolution
  corrected
  allUsersWithCorrection
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
export const FlatSolutionNodeFragmentDoc = gql`
    fragment FlatSolutionNode on FlatSampleSolutionNode {
  ...IFlatSolutionNode
}
    ${IFlatSolutionNodeFragmentDoc}`;
export const AnnotationFragmentDoc = gql`
    fragment Annotation on Annotation {
  id
  errorType
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
export const ExtractedWordFragmentDoc = gql`
    fragment ExtractedWord on ExtractedWord {
  index
  word
}
    `;
export const NounMatchingResultFragmentDoc = gql`
    fragment NounMatchingResult on NounMatchingResult {
  matches {
    sampleValue {
      ...ExtractedWord
    }
    userValue {
      ...ExtractedWord
    }
  }
}
    ${ExtractedWordFragmentDoc}`;
export const NodeMatchFragmentDoc = gql`
    fragment NodeMatch on NodeIdMatch {
  sampleValue
  userValue
  explanation {
    ...NounMatchingResult
  }
}
    ${NounMatchingResultFragmentDoc}`;
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
    mutation CreateExercise($exerciseInput: GraphQLExerciseInput!) {
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
    mutation SubmitSolution($exerciseId: Int!, $userSolution: GraphQLUserSolutionInput!) {
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
export const SubmitAnnotationDocument = gql`
    mutation SubmitAnnotation($exerciseId: Int!, $username: String!, $userSolutionNodeId: Int!, $annotationInput: AnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolutionNode(username: $username, userSolutionNodeId: $userSolutionNodeId) {
      submitAnnotation(annotation: $annotationInput) {
        ...Annotation
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
 *      userSolutionNodeId: // value for 'userSolutionNodeId'
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
    mutation UpdateAnnotation($exerciseId: Int!, $username: String!, $userSolutionNodeId: Int!, $annotationId: Int!, $annotationInput: AnnotationInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    userSolutionNode(username: $username, userSolutionNodeId: $userSolutionNodeId) {
      updateAnnotation(annotationId: $annotationId, annotation: $annotationInput) {
        ...Annotation
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
 *      userSolutionNodeId: // value for 'userSolutionNodeId'
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
    userSolutionNode(username: $username, userSolutionNodeId: $userSolutionNodeId) {
      deleteAnnotation(annotationId: $annotationId)
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
export const NewCorrectionDocument = gql`
    query NewCorrection($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    flatSampleSolution {
      ...FlatSolutionNode
    }
    flatUserSolution(username: $username) {
      ...FlatUserSolutionNode
    }
    flatCorrectionForUser(username: $username) {
      ...NodeMatch
    }
  }
}
    ${FlatSolutionNodeFragmentDoc}
${FlatUserSolutionNodeFragmentDoc}
${NodeMatchFragmentDoc}`;

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
export const SubmitCorrectionDocument = gql`
    mutation SubmitCorrection($exerciseId: Int!, $correctionInput: GraphQLCorrectionInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitCorrection(correctionInput: $correctionInput)
  }
}
    `;
export type SubmitCorrectionMutationFn = Apollo.MutationFunction<SubmitCorrectionMutation, SubmitCorrectionMutationVariables>;

/**
 * __useSubmitCorrectionMutation__
 *
 * To run a mutation, you first call `useSubmitCorrectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitCorrectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitCorrectionMutation, { data, loading, error }] = useSubmitCorrectionMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      correctionInput: // value for 'correctionInput'
 *   },
 * });
 */
export function useSubmitCorrectionMutation(baseOptions?: Apollo.MutationHookOptions<SubmitCorrectionMutation, SubmitCorrectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitCorrectionMutation, SubmitCorrectionMutationVariables>(SubmitCorrectionDocument, options);
      }
export type SubmitCorrectionMutationHookResult = ReturnType<typeof useSubmitCorrectionMutation>;
export type SubmitCorrectionMutationResult = Apollo.MutationResult<SubmitCorrectionMutation>;
export type SubmitCorrectionMutationOptions = Apollo.BaseMutationOptions<SubmitCorrectionMutation, SubmitCorrectionMutationVariables>;