import type { CodegenConfig } from '@graphql-codegen/cli';


const config: CodegenConfig = {
  schema: 'http://localhost:9016/graphql',

  documents: 'src/**/*.graphql',

  ignoreNoDocuments: true,

  generates: {
    './schema.graphql': {
      plugins: ['schema-ast']
    },

    'src/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        // typescript config options
        skipTypename: true,
        inlineFragmentTypes: 'combine',
      },
    }
  }
};

export default config;
