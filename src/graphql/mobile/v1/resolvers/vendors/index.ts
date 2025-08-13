import { mergeResolvers } from '@graphql-tools/merge';
import { vendorQueries } from './queries';

export const vendorResolvers = mergeResolvers([
  { Query: vendorQueries },
]); 