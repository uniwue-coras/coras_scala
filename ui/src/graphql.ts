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

export type ChangePasswordInput = {
  newPassword: Scalars['String'];
  newPasswordRepeat: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type CompleteExercise = {
  __typename?: 'CompleteExercise';
  allUsersWithSolution: Array<Scalars['String']>;
  id: Scalars['Int'];
  sampleSolution: Array<SolutionNode>;
  solutionForUser?: Maybe<MongoUserSolution>;
  solutionSubmitted: Scalars['Boolean'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type CompleteExerciseSolutionForUserArgs = {
  username: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  userSolutionMutations: UserSolutionMutations;
};


export type ExerciseMutationsUserSolutionMutationsArgs = {
  username: Scalars['String'];
};

export type LoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  jwt: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  rights: Rights;
  username: Scalars['String'];
};

export type MongoUserSolution = {
  __typename?: 'MongoUserSolution';
  exerciseId: Scalars['Int'];
  solution: Array<SolutionNode>;
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  exerciseMutations?: Maybe<ExerciseMutations>;
  login: LoginResult;
  register: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  changePasswordInput: ChangePasswordInput;
};


export type MutationExerciseMutationsArgs = {
  exerciseId: Scalars['Int'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type NodeMatchInput = {
  matchId: Scalars['Int'];
  parentMatchId?: InputMaybe<Scalars['Int']>;
  sampleNodeId: Scalars['Int'];
  userNodeId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  exercise?: Maybe<CompleteExercise>;
  exercises: Array<CompleteExercise>;
};


export type QueryExerciseArgs = {
  exerciseId: Scalars['Int'];
};

export type RegisterInput = {
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
  username: Scalars['String'];
};

export enum Rights {
  Admin = 'Admin',
  Corrector = 'Corrector',
  Student = 'Student'
}

export type SolutionNode = {
  __typename?: 'SolutionNode';
  applicability: Applicability;
  id: Scalars['Int'];
  subTexts: Array<SolutionNodeSubText>;
  text: Scalars['String'];
};

export type SolutionNodeSubText = {
  __typename?: 'SolutionNodeSubText';
  applicability: Applicability;
  text: Scalars['String'];
};

export type UserSolutionMutations = {
  __typename?: 'UserSolutionMutations';
  saveMatch: Scalars['Boolean'];
};


export type UserSolutionMutationsSaveMatchArgs = {
  nodeMatchInput: NodeMatchInput;
};

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type LoginResultFragment = { __typename?: 'LoginResult', username: string, name?: string | null, rights: Rights, jwt: string };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResult', username: string, name?: string | null, rights: Rights, jwt: string } };

export type ChangePasswordMutationVariables = Exact<{
  changePasswordInput: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type AllExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllExercisesQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'CompleteExercise', id: number, title: string }> };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise?: { __typename?: 'CompleteExercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string> } | null };

export type ExerciseTaskDefinitionFragment = { __typename?: 'CompleteExercise', title: string, text: string };

export type SubmitSolutionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type SubmitSolutionQuery = { __typename?: 'Query', exercise?: { __typename?: 'CompleteExercise', title: string, text: string } | null };

export type SolutionEntrySubTextFragment = { __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability };

export type FlatSolutionEntryFragment = { __typename?: 'SolutionNode', id: number, text: string, applicability: Applicability, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> };

export type ExerciseSolutionsFragment = { __typename?: 'CompleteExercise', sampleSolution: Array<{ __typename?: 'SolutionNode', id: number, text: string, applicability: Applicability, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, maybeUserSolution?: { __typename: 'MongoUserSolution' } | null };

export type CorrectExerciseQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type CorrectExerciseQuery = { __typename?: 'Query', exercise?: { __typename?: 'CompleteExercise', sampleSolution: Array<{ __typename?: 'SolutionNode', id: number, text: string, applicability: Applicability, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, maybeUserSolution?: { __typename: 'MongoUserSolution' } | null } | null };

export type SaveMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  nodeMatchInput: NodeMatchInput;
}>;


export type SaveMatchMutation = { __typename?: 'Mutation', exercise?: { __typename?: 'ExerciseMutations', solution: { __typename?: 'UserSolutionMutations', saveMatch: boolean } } | null };

export const LoginResultFragmentDoc = gql`
    fragment LoginResult on LoginResult {
  username
  name
  rights
  jwt
}
    `;
export const ExerciseTaskDefinitionFragmentDoc = gql`
    fragment ExerciseTaskDefinition on CompleteExercise {
  title
  text
}
    `;
export const SolutionEntrySubTextFragmentDoc = gql`
    fragment SolutionEntrySubText on SolutionNodeSubText {
  text
  applicability
}
    `;
export const FlatSolutionEntryFragmentDoc = gql`
    fragment FlatSolutionEntry on SolutionNode {
  id
  text
  applicability
  subTexts {
    ...SolutionEntrySubText
  }
}
    ${SolutionEntrySubTextFragmentDoc}`;
export const ExerciseSolutionsFragmentDoc = gql`
    fragment ExerciseSolutions on CompleteExercise {
  sampleSolution {
    ...FlatSolutionEntry
  }
  maybeUserSolution: solutionForUser(username: $username) {
    __typename
  }
}
    ${FlatSolutionEntryFragmentDoc}`;
export const RegisterDocument = gql`
    mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput)
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
 *      registerInput: // value for 'registerInput'
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
    mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    ...LoginResult
  }
}
    ${LoginResultFragmentDoc}`;
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
 *      loginInput: // value for 'loginInput'
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($changePasswordInput: ChangePasswordInput!) {
  changePassword(changePasswordInput: $changePasswordInput)
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
 *      changePasswordInput: // value for 'changePasswordInput'
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
export const ExerciseOverviewDocument = gql`
    query ExerciseOverview($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    title
    text
    solutionSubmitted
    allUsersWithSolution
  }
}
    `;

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
export const SubmitSolutionDocument = gql`
    query SubmitSolution($exerciseId: Int!) {
  exercise(exerciseId: $exerciseId) {
    ...ExerciseTaskDefinition
  }
}
    ${ExerciseTaskDefinitionFragmentDoc}`;

/**
 * __useSubmitSolutionQuery__
 *
 * To run a query within a React component, call `useSubmitSolutionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubmitSolutionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubmitSolutionQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *   },
 * });
 */
export function useSubmitSolutionQuery(baseOptions: Apollo.QueryHookOptions<SubmitSolutionQuery, SubmitSolutionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SubmitSolutionQuery, SubmitSolutionQueryVariables>(SubmitSolutionDocument, options);
      }
export function useSubmitSolutionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubmitSolutionQuery, SubmitSolutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SubmitSolutionQuery, SubmitSolutionQueryVariables>(SubmitSolutionDocument, options);
        }
export type SubmitSolutionQueryHookResult = ReturnType<typeof useSubmitSolutionQuery>;
export type SubmitSolutionLazyQueryHookResult = ReturnType<typeof useSubmitSolutionLazyQuery>;
export type SubmitSolutionQueryResult = Apollo.QueryResult<SubmitSolutionQuery, SubmitSolutionQueryVariables>;
export const CorrectExerciseDocument = gql`
    query CorrectExercise($exerciseId: Int!, $username: String!) {
  exercise(exerciseId: $exerciseId) {
    ...ExerciseSolutions
  }
}
    ${ExerciseSolutionsFragmentDoc}`;

/**
 * __useCorrectExerciseQuery__
 *
 * To run a query within a React component, call `useCorrectExerciseQuery` and pass it any options that fit your needs.
 * When your component renders, `useCorrectExerciseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCorrectExerciseQuery({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCorrectExerciseQuery(baseOptions: Apollo.QueryHookOptions<CorrectExerciseQuery, CorrectExerciseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CorrectExerciseQuery, CorrectExerciseQueryVariables>(CorrectExerciseDocument, options);
      }
export function useCorrectExerciseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CorrectExerciseQuery, CorrectExerciseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CorrectExerciseQuery, CorrectExerciseQueryVariables>(CorrectExerciseDocument, options);
        }
export type CorrectExerciseQueryHookResult = ReturnType<typeof useCorrectExerciseQuery>;
export type CorrectExerciseLazyQueryHookResult = ReturnType<typeof useCorrectExerciseLazyQuery>;
export type CorrectExerciseQueryResult = Apollo.QueryResult<CorrectExerciseQuery, CorrectExerciseQueryVariables>;
export const SaveMatchDocument = gql`
    mutation SaveMatch($exerciseId: Int!, $username: String!, $nodeMatchInput: NodeMatchInput!) {
  exercise: exerciseMutations(exerciseId: $exerciseId) {
    solution: userSolutionMutations(username: $username) {
      saveMatch(nodeMatchInput: $nodeMatchInput)
    }
  }
}
    `;
export type SaveMatchMutationFn = Apollo.MutationFunction<SaveMatchMutation, SaveMatchMutationVariables>;

/**
 * __useSaveMatchMutation__
 *
 * To run a mutation, you first call `useSaveMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveMatchMutation, { data, loading, error }] = useSaveMatchMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      username: // value for 'username'
 *      nodeMatchInput: // value for 'nodeMatchInput'
 *   },
 * });
 */
export function useSaveMatchMutation(baseOptions?: Apollo.MutationHookOptions<SaveMatchMutation, SaveMatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveMatchMutation, SaveMatchMutationVariables>(SaveMatchDocument, options);
      }
export type SaveMatchMutationHookResult = ReturnType<typeof useSaveMatchMutation>;
export type SaveMatchMutationResult = Apollo.MutationResult<SaveMatchMutation>;
export type SaveMatchMutationOptions = Apollo.BaseMutationOptions<SaveMatchMutation, SaveMatchMutationVariables>;