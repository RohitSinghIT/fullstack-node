import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';

// Load all GraphQL schema files for Mobile V1
const typesArray = loadFilesSync(path.join(__dirname, './**/*.graphql'));

export const mobileV1Schema = mergeTypeDefs(typesArray); 