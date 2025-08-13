import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const getVendors = async (
  _: any,
  { page = 1, limit = 20, status, search }: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { storeAddress: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
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