
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8080/graphql",
  documents: ['src/**/*.{ts,tsx}', 'src/pages/*.{ts,tsx}'],
  generates: {

    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',

      },
      config: {
        scalars: {
          Long: { input: 'number', output: 'number' }
        }
      }

    }
  },
  ignoreNoDocuments: true,
};

export default config;
