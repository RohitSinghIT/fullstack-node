import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const orders = async (
  _: any,
  { page = 1, limit = 20, status, vendorId, customerId }: {
    page?: number;
    limit?: number;
    status?: string;
    vendorId?: string;
    customerId?: string;
  }
) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (vendorId) {
      where.vendorId = vendorId;
    }
    
    if (customerId) {
      where.customerId = customerId;
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
          vendor: {
            select: {
              id: true,
              storeName: true,
              storeAddress: true,
            },
          },
          orderDetails: {
            include: {
              product: true,
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
    throw new GraphQLError('Failed to fetch orders');
  }
};
