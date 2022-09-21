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

export enum Applicability {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable',
  NotSpecified = 'NotSpecified'
}

export type Exercise = {
  __typename?: 'Exercise';
  allUsersWithCorrection: Array<Scalars['String']>;
  allUsersWithSolution: Array<Scalars['String']>;
  corrected: Scalars['Boolean'];
  /** @deprecated Will be removed! */
  correctionForUserAsJson?: Maybe<Scalars['String']>;
  flatCorrectionForUser: FlatCorrection;
  flatSampleSolution: Array<FlatSolutionNode>;
  flatUserSolution?: Maybe<Array<FlatSolutionNode>>;
  id: Scalars['Int'];
  /** @deprecated Will be removed! */
  solutionForUserAsJson?: Maybe<Scalars['String']>;
  solutionSubmitted: Scalars['Boolean'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type ExerciseCorrectionForUserAsJsonArgs = {
  username: Scalars['String'];
};


export type ExerciseFlatCorrectionForUserArgs = {
  username: Scalars['String'];
};


export type ExerciseFlatUserSolutionArgs = {
  username: Scalars['String'];
};


export type ExerciseSolutionForUserAsJsonArgs = {
  username: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  submitCorrection: Scalars['Boolean'];
  submitSolution: Scalars['Boolean'];
};


export type ExerciseMutationsSubmitCorrectionArgs = {
  correctionInput: GraphQlCorrectionInput;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  userSolution: GraphQlUserSolutionInput;
};

export type FlatCorrection = {
  __typename?: 'FlatCorrection';
  matchingResult: Array<FlatSolutionNodeMatch>;
  sampleSolution: Array<FlatSolutionNode>;
  userSolution: Array<FlatSolutionNode>;
};

export type FlatSolutionNode = {
  __typename?: 'FlatSolutionNode';
  applicability: Applicability;
  childIndex: Scalars['Int'];
  id: Scalars['Int'];
  parentId?: Maybe<Scalars['Int']>;
  subTexts: Array<SolutionNodeSubText>;
  text: Scalars['String'];
};

export type FlatSolutionNodeMatch = {
  __typename?: 'FlatSolutionNodeMatch';
  sampleNodeId: Scalars['Int'];
  userNodeId: Scalars['Int'];
};

export type GraphQlCorrectionInput = {
  correctionAsJson: Scalars['String'];
  username: Scalars['String'];
};

export type GraphQlExerciseInput = {
  sampleSolutionAsJson: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type GraphQlUserSolutionInput = {
  maybeUsername?: InputMaybe<Scalars['String']>;
  solutionAsJson: Scalars['String'];
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

export type Query = {
  __typename?: 'Query';
  exercise: Exercise;
  exercises: Array<Exercise>;
};


export type QueryExerciseArgs = {
  exerciseId: Scalars['Int'];
};

export type SolutionNodeSubText = {
  __typename?: 'SolutionNodeSubText';
  applicability: Applicability;
  text: Scalars['String'];
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

export type ExerciseOverviewFragment = { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string>, corrected: boolean, allUsersWithCorrection: Array<string> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string>, corrected: boolean, allUsersWithCorrection: Array<string> } };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type ExerciseTaskDefinitionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseTaskDefinitionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', title: string, text: string } };

export type SubmitSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  userSolution: GraphQlUserSolutionInput;
}>;


export type SubmitSolutionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitSolution: boolean } | null };

export type FlatSolutionNodeFragment = { __typename?: 'FlatSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> };

export type FlatSolutionNodeMatchFragment = { __typename?: 'FlatSolutionNodeMatch', userNodeId: number, sampleNodeId: number };

export type FlatCorrectionFragment = { __typename?: 'FlatCorrection', sampleSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, userSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, matchingResult: Array<{ __typename?: 'FlatSolutionNodeMatch', userNodeId: number, sampleNodeId: number }> };

export type NewCorrectionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type NewCorrectionQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', flatCorrectionForUser: { __typename?: 'FlatCorrection', sampleSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, userSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, childIndex: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, matchingResult: Array<{ __typename?: 'FlatSolutionNodeMatch', userNodeId: number, sampleNodeId: number }> } } };

export type UpdateCorrectionValuesQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type UpdateCorrectionValuesQuery = { __typename?: 'Query', exercise: { __typename?: 'Exercise', correctionForUserAsJson?: string | null } };

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
export const FlatSolutionNodeFragmentDoc = gql`
    fragment FlatSolutionNode on FlatSolutionNode {
  id
  childIndex
  text
  applicability
  subTexts {
    text
    applicability
  }
  parentId
}
    `;
export const FlatSolutionNodeMatchFragmentDoc = gql`
    fragment FlatSolutionNodeMatch on FlatSolutionNodeMatch {
  userNodeId
  sampleNodeId
}
    `;
export const FlatCorrectionFragmentDoc = gql`
    fragment FlatCorrection on FlatCorrection {
  sampleSolution {
    ...FlatSolutionNode
  }
  userSolution {
    ...FlatSolutionNode
  }
  matchingResult {
    ...FlatSolutionNodeMatch
  }
}
    ${FlatSolutionNodeFragmentDoc}
${FlatSolutionNodeMatchFragmentDoc}`;
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
export const NewCorrectionDocument = gql`
    query NewCorrection($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    flatCorrectionForUser(username: $username) {
      ...FlatCorrection
    }
  }
}
    ${FlatCorrectionFragmentDoc}`;

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
export const UpdateCorrectionValuesDocument = gql`
    query UpdateCorrectionValues($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    correctionForUserAsJson(username: $username)
  }
}
    `;

/**
 * __useUpdateCorrectionValuesQuery__
 *
 * To run a query within a React component, call `useUpdateCorrectionValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdateCorrectionValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdateCorrectionValuesQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUpdateCorrectionValuesQuery(baseOptions: Apollo.QueryHookOptions<UpdateCorrectionValuesQuery, UpdateCorrectionValuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdateCorrectionValuesQuery, UpdateCorrectionValuesQueryVariables>(UpdateCorrectionValuesDocument, options);
      }
export function useUpdateCorrectionValuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdateCorrectionValuesQuery, UpdateCorrectionValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdateCorrectionValuesQuery, UpdateCorrectionValuesQueryVariables>(UpdateCorrectionValuesDocument, options);
        }
export type UpdateCorrectionValuesQueryHookResult = ReturnType<typeof useUpdateCorrectionValuesQuery>;
export type UpdateCorrectionValuesLazyQueryHookResult = ReturnType<typeof useUpdateCorrectionValuesLazyQuery>;
export type UpdateCorrectionValuesQueryResult = Apollo.QueryResult<UpdateCorrectionValuesQuery, UpdateCorrectionValuesQueryVariables>;
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