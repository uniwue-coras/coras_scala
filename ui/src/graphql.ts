import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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
  addExercise: Scalars['Int'];
  changeUserRights: Rights;
};


export type AdminMutationsAddExerciseArgs = {
  exerciseInput: ExerciseInput;
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

export type AnalyzedSubText = {
  __typename?: 'AnalyzedSubText';
  applicability: Applicability;
  text: Scalars['String'];
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

export type Exercise = {
  __typename?: 'Exercise';
  allUsersWithSolution: Array<Scalars['String']>;
  id: Scalars['Int'];
  sampleSolution: Array<FlatSolutionEntry>;
  solutionForUser: Array<Array<FlatSolutionEntry>>;
  solutionSubmitted: Scalars['Boolean'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type ExerciseSolutionForUserArgs = {
  username: Scalars['String'];
};

export type ExerciseInput = {
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type ExerciseMutations = {
  __typename?: 'ExerciseMutations';
  submitSolutionForUser: Scalars['Boolean'];
  submitUserSolution: Scalars['Boolean'];
};


export type ExerciseMutationsSubmitSolutionForUserArgs = {
  solution: Array<FlatSolutionEntryInput>;
  username: Scalars['String'];
};


export type ExerciseMutationsSubmitUserSolutionArgs = {
  solution: Array<FlatSolutionEntryInput>;
};

export type FlatSolutionEntry = {
  __typename?: 'FlatSolutionEntry';
  applicability: Applicability;
  id: Scalars['Int'];
  paragraphCitations: Array<ParagraphCitation>;
  parentId?: Maybe<Scalars['Int']>;
  priorityPoints?: Maybe<Scalars['Int']>;
  subTexts: Array<AnalyzedSubText>;
  text: Scalars['String'];
  weight?: Maybe<Scalars['Int']>;
};

export type FlatSolutionEntryInput = {
  applicability: Applicability;
  id: Scalars['Int'];
  parentId?: InputMaybe<Scalars['Int']>;
  priorityPoints?: InputMaybe<Scalars['Int']>;
  text: Scalars['String'];
  weight?: InputMaybe<Scalars['Int']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  adminMutations: AdminMutations;
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

export type ParagraphCitation = {
  __typename?: 'ParagraphCitation';
  endIndex: Scalars['Int'];
  id: Scalars['Int'];
  lawCode?: Maybe<Scalars['String']>;
  paragraph: Scalars['Int'];
  paragraphType: ParagraphType;
  sentence?: Maybe<Scalars['Int']>;
  startIndex: Scalars['Int'];
  subParagraph?: Maybe<Scalars['Int']>;
};

export enum ParagraphType {
  Bavarian = 'Bavarian',
  German = 'German'
}

export type Query = {
  __typename?: 'Query';
  adminQueries: AdminQueries;
  exercise?: Maybe<Exercise>;
  exercises: Array<Exercise>;
  testDocx: Scalars['Boolean'];
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

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type LoginResultFragment = { __typename?: 'LoginResult', username: string, name?: string | null | undefined, rights: Rights, jwt: string };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResult', username: string, name?: string | null | undefined, rights: Rights, jwt: string } };

export type AllExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllExercisesQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'Exercise', id: number, title: string }> };

export type ChangePasswordMutationVariables = Exact<{
  changePasswordInput: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

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

export type AddExerciseMutationVariables = Exact<{
  exerciseInput: ExerciseInput;
}>;


export type AddExerciseMutation = { __typename?: 'Mutation', adminMutations: { __typename?: 'AdminMutations', addExercise: number } };

export type ExerciseOverviewQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type ExerciseOverviewQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string, solutionSubmitted: boolean, allUsersWithSolution: Array<string> } | null | undefined };

export type SubmitSolutionForUserMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
  solution: Array<FlatSolutionEntryInput> | FlatSolutionEntryInput;
}>;


export type SubmitSolutionForUserMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitSolutionForUser: boolean } | null | undefined };

export type SubmitUserSolutionMutationVariables = Exact<{
  exerciseId: Scalars['Int'];
  solution: Array<FlatSolutionEntryInput> | FlatSolutionEntryInput;
}>;


export type SubmitUserSolutionMutation = { __typename?: 'Mutation', exerciseMutations?: { __typename?: 'ExerciseMutations', submitUserSolution: boolean } | null | undefined };

export type ExerciseTaskDefinitionFragment = { __typename?: 'Exercise', title: string, text: string };

export type SubmitSolutionQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
}>;


export type SubmitSolutionQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', title: string, text: string } | null | undefined };

export type SubTextFragment = { __typename?: 'AnalyzedSubText', text: string, applicability: Applicability };

export type ParagraphCitationFragment = { __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined };

export type FlatSolutionEntryFragment = { __typename?: 'FlatSolutionEntry', id: number, text: string, applicability: Applicability, weight?: number | null | undefined, priorityPoints?: number | null | undefined, parentId?: number | null | undefined, subTexts: Array<{ __typename?: 'AnalyzedSubText', text: string, applicability: Applicability }>, paragraphCitations: Array<{ __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined }> };

export type ExerciseSolutionsFragment = { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSolutionEntry', id: number, text: string, applicability: Applicability, weight?: number | null | undefined, priorityPoints?: number | null | undefined, parentId?: number | null | undefined, subTexts: Array<{ __typename?: 'AnalyzedSubText', text: string, applicability: Applicability }>, paragraphCitations: Array<{ __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined }> }>, maybeUserSolution: Array<Array<{ __typename?: 'FlatSolutionEntry', id: number, text: string, applicability: Applicability, weight?: number | null | undefined, priorityPoints?: number | null | undefined, parentId?: number | null | undefined, subTexts: Array<{ __typename?: 'AnalyzedSubText', text: string, applicability: Applicability }>, paragraphCitations: Array<{ __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined }> }>> };

export type CorrectExerciseQueryVariables = Exact<{
  exerciseId: Scalars['Int'];
  username: Scalars['String'];
}>;


export type CorrectExerciseQuery = { __typename?: 'Query', exercise?: { __typename?: 'Exercise', sampleSolution: Array<{ __typename?: 'FlatSolutionEntry', id: number, text: string, applicability: Applicability, weight?: number | null | undefined, priorityPoints?: number | null | undefined, parentId?: number | null | undefined, subTexts: Array<{ __typename?: 'AnalyzedSubText', text: string, applicability: Applicability }>, paragraphCitations: Array<{ __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined }> }>, maybeUserSolution: Array<Array<{ __typename?: 'FlatSolutionEntry', id: number, text: string, applicability: Applicability, weight?: number | null | undefined, priorityPoints?: number | null | undefined, parentId?: number | null | undefined, subTexts: Array<{ __typename?: 'AnalyzedSubText', text: string, applicability: Applicability }>, paragraphCitations: Array<{ __typename?: 'ParagraphCitation', id: number, startIndex: number, endIndex: number, paragraphType: ParagraphType, paragraph: number, subParagraph?: number | null | undefined, sentence?: number | null | undefined, lawCode?: string | null | undefined }> }>> } | null | undefined };

export const LoginResultFragmentDoc = gql`
    fragment LoginResult on LoginResult {
  username
  name
  rights
  jwt
}
    `;
export const ExerciseTaskDefinitionFragmentDoc = gql`
    fragment ExerciseTaskDefinition on Exercise {
  title
  text
}
    `;
export const SubTextFragmentDoc = gql`
    fragment SubText on AnalyzedSubText {
  text
  applicability
}
    `;
export const ParagraphCitationFragmentDoc = gql`
    fragment ParagraphCitation on ParagraphCitation {
  id
  startIndex
  endIndex
  paragraphType
  paragraph
  subParagraph
  sentence
  lawCode
}
    `;
export const FlatSolutionEntryFragmentDoc = gql`
    fragment FlatSolutionEntry on FlatSolutionEntry {
  id
  text
  applicability
  weight
  priorityPoints
  subTexts {
    ...SubText
  }
  paragraphCitations {
    ...ParagraphCitation
  }
  parentId
}
    ${SubTextFragmentDoc}
${ParagraphCitationFragmentDoc}`;
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
export const AddExerciseDocument = gql`
    mutation AddExercise($exerciseInput: ExerciseInput!) {
  adminMutations {
    addExercise(exerciseInput: $exerciseInput)
  }
}
    `;
export type AddExerciseMutationFn = Apollo.MutationFunction<AddExerciseMutation, AddExerciseMutationVariables>;

/**
 * __useAddExerciseMutation__
 *
 * To run a mutation, you first call `useAddExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExerciseMutation, { data, loading, error }] = useAddExerciseMutation({
 *   variables: {
 *      exerciseInput: // value for 'exerciseInput'
 *   },
 * });
 */
export function useAddExerciseMutation(baseOptions?: Apollo.MutationHookOptions<AddExerciseMutation, AddExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddExerciseMutation, AddExerciseMutationVariables>(AddExerciseDocument, options);
      }
export type AddExerciseMutationHookResult = ReturnType<typeof useAddExerciseMutation>;
export type AddExerciseMutationResult = Apollo.MutationResult<AddExerciseMutation>;
export type AddExerciseMutationOptions = Apollo.BaseMutationOptions<AddExerciseMutation, AddExerciseMutationVariables>;
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
    mutation SubmitSolutionForUser($exerciseId: Int!, $username: String!, $solution: [FlatSolutionEntryInput!]!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitSolutionForUser(username: $username, solution: $solution)
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
 *      username: // value for 'username'
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
export const SubmitUserSolutionDocument = gql`
    mutation SubmitUserSolution($exerciseId: Int!, $solution: [FlatSolutionEntryInput!]!) {
  exerciseMutations(exerciseId: $exerciseId) {
    submitUserSolution(solution: $solution)
  }
}
    `;
export type SubmitUserSolutionMutationFn = Apollo.MutationFunction<SubmitUserSolutionMutation, SubmitUserSolutionMutationVariables>;

/**
 * __useSubmitUserSolutionMutation__
 *
 * To run a mutation, you first call `useSubmitUserSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitUserSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitUserSolutionMutation, { data, loading, error }] = useSubmitUserSolutionMutation({
 *   variables: {
 *      exerciseId: // value for 'exerciseId'
 *      solution: // value for 'solution'
 *   },
 * });
 */
export function useSubmitUserSolutionMutation(baseOptions?: Apollo.MutationHookOptions<SubmitUserSolutionMutation, SubmitUserSolutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitUserSolutionMutation, SubmitUserSolutionMutationVariables>(SubmitUserSolutionDocument, options);
      }
export type SubmitUserSolutionMutationHookResult = ReturnType<typeof useSubmitUserSolutionMutation>;
export type SubmitUserSolutionMutationResult = Apollo.MutationResult<SubmitUserSolutionMutation>;
export type SubmitUserSolutionMutationOptions = Apollo.BaseMutationOptions<SubmitUserSolutionMutation, SubmitUserSolutionMutationVariables>;
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