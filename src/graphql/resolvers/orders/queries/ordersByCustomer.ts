import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const ordersByCustomer = async (
  _: any,
  { customerId, page = 1, limit = 20 }: {
    customerId: string;
    page?: number;
    limit?: number;
  }
) => {
  try {
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        include: {
          vendor: {
            select: {
              id: true,
              storeName: true,
              storeAddress: true,
              storeImage: true,
            },
          },
          orderDetails: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
              variant: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { customerId } }),
    ]);

    return {
      orders,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    throw new GraphQLError('Failed to fetch customer orders');
  }
};
