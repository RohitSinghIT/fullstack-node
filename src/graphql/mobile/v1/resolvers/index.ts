import { authResolvers } from './auth';
import { productResolvers } from './products';
import { vendorResolvers } from './vendors';
import { orderResolvers } from './orders';
import { userResolvers } from './users';
import { reviewResolvers } from './reviews';

export const mobileV1Resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
    ...vendorResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...userResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
}; 