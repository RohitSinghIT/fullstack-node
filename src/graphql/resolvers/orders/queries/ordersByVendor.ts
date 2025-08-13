import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const ordersByVendor = async (
  _: any,
  { vendorId, page = 1, limit = 20, status }: {
    vendorId: string;
    page?: number;
    limit?: number;
    status?: string;
  }
) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = { vendorId };
    
    if (status) {
      where.status = status;
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
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
          deliveryAssignments: {
            include: {
              deliveryBoy: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    throw new GraphQLError('Failed to fetch vendor orders');
  }
};
