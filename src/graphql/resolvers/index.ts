import { mergeResolvers } from '@graphql-tools/merge';
import { authResolvers } from './auth';
import { usersResolvers } from './users';
import { customerResolvers } from './customers';
import { productResolvers } from './products';
import { categoryResolvers } from './categories';
import { vendorsResolvers } from './vendors';
import { ordersResolvers } from './orders';
import { wishlistsResolvers } from './wishlists';
import { walletsResolvers } from './wallets';
import { reviewsResolvers } from './reviews';
import { deliveryResolvers } from './delivery';
import { notificationsResolvers } from './notifications';
import { configsResolvers } from './configs';

// Merge all resolvers
export const resolvers = mergeResolvers([
  authResolvers,
  usersResolvers,
  customerResolvers,
  productResolvers,
  categoryResolvers,
  vendorsResolvers,
  ordersResolvers,
  wishlistsResolvers,
  walletsResolvers,
  reviewsResolvers,
  deliveryResolvers,
  notificationsResolvers,
  configsResolvers,
]); 