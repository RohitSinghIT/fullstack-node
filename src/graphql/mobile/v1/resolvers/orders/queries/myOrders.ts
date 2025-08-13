import { Context } from '../../../../../../types/context';

export const myOrders = async (
  _: any,
  { page = 1, limit = 20, status }: {
    page?: number;
    limit?: number;
    status?: string;
  },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const skip = (page - 1) * limit;
  
  const where: any = {
    customerId: user.id,
  };

  if (status) {
    where.status = status;
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  const edges = orders.map((order, index) => ({
    node: order,
    cursor: Buffer.from(`${skip + index}`).toString('base64'),
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: skip + limit < totalCount,
      hasPreviousPage: page > 1,
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
    },
    totalCount,
  };
};
