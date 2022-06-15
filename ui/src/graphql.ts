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

export type AdminMutations = {
  __typename?: 'AdminMutations';
  changeUserRights: Rights;
};


export type AdminMutationsChangeUserRightsArgs = {
  rights: Rights;
  username: Scalars['String'];
};

export type AdminQueries = {
  __typename?: 'AdminQueries';
  usersByPrefix: Array<Scalars['String']>;
  usersWithRights: Array<Scalars['String']>;
};


export type AdminQueriesUsersByPrefixArgs = {
  prefix: Scalars['String'];
};


export type AdminQueriesUsersWithRightsArgs = {
  rights: Rights;
};

export enum Applicability {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable',
  NotSpecified = 'NotSpecified'
}

export type Exercise = {
  __typename?: 'Exercise';
  allUsersWithSolution: Array<Scalars['String']>;
  id: Scalars['Int'];
  sampleSolution: Array<FlatSolutionNode>;
  solutionForUser: Array<FlatSolutionNode>;
  solutionSubmitted: Scalars['Boolean'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type ExerciseSolutionForUserArgs = {
  username: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  submitSolution: Scalars['Boolean'];
  userSolutionMutations: UserSolutionMutations;
};


export type ExerciseMutationsSubmitSolutionArgs = {
  solution: SubmitSolutionInput;
};


export type ExerciseMutationsUserSolutionMutationsArgs = {
  username: Scalars['String'];
};

export type FlatSolutionNode = {
  __typename?: 'FlatSolutionNode';
  applicability: Applicability;
  id: Scalars['Int'];
  parentId?: Maybe<Scalars['Int']>;
  subTexts: Array<SolutionNodeSubText>;
  text: Scalars['String'];
};

export type FlatSolutionNodeInput = {
  applicability: Applicability;
  id: Scalars['Int'];
  parentId?: InputMaybe<Scalars['Int']>;
  subTexts: Array<SolutionEntrySubTextInput>;
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminMutations: AdminMutations;
  exerciseMutations?: Maybe<ExerciseMutations>;
};


export type MutationExerciseMutationsArgs = {
  exerciseId: Scalars['Int'];
};

export type NodeMatchInput = {
  matchId: Scalars['Int'];
  parentMatchId?: InputMaybe<Scalars['Int']>;
  sampleNodeId: Scalars['Int'];
  userNodeId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  adminQueries: AdminQueries;
  exercise?: Maybe<Exercise>;
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

export type SolutionEntrySubTextInput = {
  applicability: Applicability;
  text: Scalars['String'];
};

export type SolutionNodeSubText = {
  __typename?: 'SolutionNodeSubText';
  applicability: Applicability;
  text: Scalars['String'];
};

export type SubmitSolutionInput = {
  solution: Array<FlatSolutionNodeInput>;
  username?: InputMaybe<Scalars['String']>;
};

export type UserSolutionMutations = {
  __typename?: 'UserSolutionMutations';
  saveMatch: Scalars['Boolean'];
};


export type UserSolutionMutationsSaveMatchArgs = {
  nodeMatchInput: NodeMatchInput;
};

export type AllExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllExercisesQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'Exercise', id: number, title: string }> };

export type UsersWithRightsQueryVariables = Exact<{
  rights: Rights;
}>;


export type UsersWithRightsQuery = { __typename?: 'Query', adminQueries: { __typename?: 'AdminQueries', usersWithRights: Array<string> } };

export type UsersByPrefixQueryVariables = Exact<{
  prefix: Scalars['String'];
}>;


export type UsersByPrefixQuery = { __typename?: 'Query', adminQueries: { __typename?: 'AdminQueries', usersByPrefix: Array<string> } };

export type ChangeUserRightsMutationVariables = Exact<{
  username: Scalars['String'];
  rights: Rights;
}>;


export type ChangeUserRightsMutation = { __typename?: 'Mutation', adminMutations: { __typename?: 'AdminMutations', changeUserRights: Rights } };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string> } | null };

export type SubmitSolutionForUserMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  solution: SubmitSolutionInput;
}>;


export type SubmitSolutionForUserMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitSolution: boolean } | null };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type SubmitSolutionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string } | null };

export type SolutionEntrySubTextFragment = { __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability };

export type FlatSolutionEntryFragment = { __typename?: 'FlatSolutionNode', id: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> };

export type ExerciseSolutionsFragment = { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, maybeUserSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }> };

export type CorrectExerciseQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type CorrectExerciseQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }>, maybeUserSolution: Array<{ __typename?: 'FlatSolutionNode', id: number, text: string, applicability: Applicability, parentId?: number | null, subTexts: Array<{ __typename?: 'SolutionNodeSubText', text: string, applicability: Applicability }> }> } | null };

export type SaveMatchMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  nodeMatchInput: NodeMatchInput;
}>;


export type SaveMatchMutation = { __typename?: 'Mutation', exercise?: { __typename?: 'ExerciseMutations', solution: { __typename?: 'UserSolutionMutations', saveMatch: boolean } } | null };

export const ExerciseTaskDefinitionFragmentDoc = gql`
    fragment ExerciseTaskDefinition on Exercise {
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
    fragment FlatSolutionEntry on FlatSolutionNode {
  id
  text
  applicability
  parentId
  subTexts {
    ...SolutionEntrySubText
  }
}
    ${SolutionEntrySubTextFragmentDoc}`;
export const ExerciseSolutionsFragmentDoc = gql`
    fragment ExerciseSolutions on Exercise {
  sampleSolution {
    ...FlatSolutionEntry
  }
  maybeUserSolution: solutionForUser(username: $username) {
    ...FlatSolutionEntry
  }
}
    ${FlatSolutionEntryFragmentDoc}`;
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
export const UsersWithRightsDocument = gql`
    query UsersWithRights($rights: Rights!) {
  adminQueries {
    usersWithRights(rights: $rights)
  }
}
    `;

/**
 * __useUsersWithRightsQuery__
 *
 * To run a query within a React component, call `useUsersWithRightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersWithRightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersWithRightsQuery({
 *   variables: {
 *      rights: // value for 'rights'
 *   },
 * });
 */
export function useUsersWithRightsQuery(baseOptions: Apollo.QueryHookOptions<UsersWithRightsQuery, UsersWithRightsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersWithRightsQuery, UsersWithRightsQueryVariables>(UsersWithRightsDocument, options);
      }
export function useUsersWithRightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersWithRightsQuery, UsersWithRightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersWithRightsQuery, UsersWithRightsQueryVariables>(UsersWithRightsDocument, options);
        }
export type UsersWithRightsQueryHookResult = ReturnType<typeof useUsersWithRightsQuery>;
export type UsersWithRightsLazyQueryHookResult = ReturnType<typeof useUsersWithRightsLazyQuery>;
export type UsersWithRightsQueryResult = Apollo.QueryResult<UsersWithRightsQuery, UsersWithRightsQueryVariables>;
export const UsersByPrefixDocument = gql`
    query UsersByPrefix($prefix: String!) {
  adminQueries {
    usersByPrefix(prefix: $prefix)
  }
}
    `;

/**
 * __useUsersByPrefixQuery__
 *
 * To run a query within a React component, call `useUsersByPrefixQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByPrefixQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersByPrefixQuery({
 *   variables: {
 *      prefix: // value for 'prefix'
 *   },
 * });
 */
export function useUsersByPrefixQuery(baseOptions: Apollo.QueryHookOptions<UsersByPrefixQuery, UsersByPrefixQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersByPrefixQuery, UsersByPrefixQueryVariables>(UsersByPrefixDocument, options);
      }
export function useUsersByPrefixLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersByPrefixQuery, UsersByPrefixQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersByPrefixQuery, UsersByPrefixQueryVariables>(UsersByPrefixDocument, options);
        }
export type UsersByPrefixQueryHookResult = ReturnType<typeof useUsersByPrefixQuery>;
export type UsersByPrefixLazyQueryHookResult = ReturnType<typeof useUsersByPrefixLazyQuery>;
export type UsersByPrefixQueryResult = Apollo.QueryResult<UsersByPrefixQuery, UsersByPrefixQueryVariables>;
export const ChangeUserRightsDocument = gql`
    mutation ChangeUserRights($username: String!, $rights: Rights!) {
  adminMutations {
    changeUserRights(username: $username, rights: $rights)
  }
}
    `;
export type ChangeUserRightsMutationFn = Apollo.MutationFunction<ChangeUserRightsMutation, ChangeUserRightsMutationVariables>;

/**
 * __useChangeUserRightsMutation__
 *
 * To run a mutation, you first call `useChangeUserRightsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserRightsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserRightsMutation, { data, loading, error }] = useChangeUserRightsMutation({
 *   variables: {
 *      username: // value for 'username'
 *      rights: // value for 'rights'
 *   },
 * });
 */
export function useChangeUserRightsMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUserRightsMutation, ChangeUserRightsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUserRightsMutation, ChangeUserRightsMutationVariables>(ChangeUserRightsDocument, options);
      }
export type ChangeUserRightsMutationHookResult = ReturnType<typeof useChangeUserRightsMutation>;
export type ChangeUserRightsMutationResult = Apollo.MutationResult<ChangeUserRightsMutation>;
export type ChangeUserRightsMutationOptions = Apollo.BaseMutationOptions<ChangeUserRightsMutation, ChangeUserRightsMutationVariables>;
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
export const SubmitSolutionForUserDocument = gql`
    mutation SubmitSolutionForUser($exerciseId: Int!, $solution: SubmitSolutionInput!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitSolution(solution: $solution)
  }
}
    `;
export type SubmitSolutionForUserMutationFn = Apollo.MutationFunction<SubmitSolutionForUserMutation, SubmitSolutionForUserMutationVariables>;

/**
 * __useSubmitSolutionForUserMutation__
 *
 * To run a mutation, you first call `useSubmitSolutionForUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitSolutionForUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitSolutionForUserMutation, { data, loading, error }] = useSubmitSolutionForUserMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      solution: // value for 'solution'
 *   },
 * });
 */
export function useSubmitSolutionForUserMutation(baseOptions?: Apollo.MutationHookOptions<SubmitSolutionForUserMutation, SubmitSolutionForUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitSolutionForUserMutation, SubmitSolutionForUserMutationVariables>(SubmitSolutionForUserDocument, options);
      }
export type SubmitSolutionForUserMutationHookResult = ReturnType<typeof useSubmitSolutionForUserMutation>;
export type SubmitSolutionForUserMutationResult = Apollo.MutationResult<SubmitSolutionForUserMutation>;
export type SubmitSolutionForUserMutationOptions = Apollo.BaseMutationOptions<SubmitSolutionForUserMutation, SubmitSolutionForUserMutationVariables>;
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