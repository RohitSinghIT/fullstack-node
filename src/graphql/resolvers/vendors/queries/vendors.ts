import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const vendors = async (
  _: any,
  { page = 1, limit = 20, search, status }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }
) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { storeAddress: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [vendors, totalCount] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          vendorProducts: {
            where: { isActive: true },
            _count: true,
          },
          orders: {
            _count: true,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vendor.count({ where }),
    ]);

    return {
      vendors,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    throw new GraphQLError('Failed to fetch vendors');
  }
};
