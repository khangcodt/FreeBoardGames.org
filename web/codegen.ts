import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../common/gql/schema.gql',
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    'src/gqlTypes/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        skipTypename: false,
        enumsAsTypes: true,
        namingConvention: 'keep',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
