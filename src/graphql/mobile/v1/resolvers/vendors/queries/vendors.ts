import { Context } from '../../../../../../types/context';

export const vendors = async (
  _: any,
  { page = 1, limit = 20, search }: {
    page?: number;
    limit?: number;
    search?: string;
  },
  { prisma }: Context
) => {
  const skip = (page - 1) * limit;
  
  const where: any = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [vendors, totalCount] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.vendor.count({ where }),
  ]);

  const edges = vendors.map((vendor, index) => ({
    node: vendor,
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
