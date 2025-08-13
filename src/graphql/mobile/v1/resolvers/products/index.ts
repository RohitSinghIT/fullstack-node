import { mergeResolvers } from '@graphql-tools/merge';
import { productQueries } from './queries';

export const productResolvers = mergeResolvers([
  { Query: productQueries },
]); 