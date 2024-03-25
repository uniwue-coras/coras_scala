import type { CodegenConfig } from '@graphql-codegen/cli';


const config: CodegenConfig = {
  schema: 'http://localhost:9016/graphql',

  ignoreNoDocuments: true,

  generates: {
    './schema.graphql': {
      plugins: ['schema-ast']
    }
  }
};

export default config;
