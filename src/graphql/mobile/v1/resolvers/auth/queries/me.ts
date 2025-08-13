import { Context } from '../../../../../../types/context';

export const me = async (_: any, __: any, { user, prisma }: Context) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  // Get user statistics for mobile
  const [totalOrders, totalSpent, favoriteVendors] = await Promise.all([
    prisma.order.count({
      where: { customerId: user.id },
    }),
    prisma.order.aggregate({
      where: { customerId: user.id },
      _sum: { totalAmount: true },
    }),
    prisma.order.groupBy({
      by: ['vendorId'],
      where: { customerId: user.id },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    ...user,
    totalOrders,
    totalSpent: totalSpent._sum.totalAmount || 0,
    favoriteVendors: favoriteVendors.map(fv => ({ id: fv.vendorId })),
  };
};
