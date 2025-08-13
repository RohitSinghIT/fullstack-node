import { Context } from '../../../../../../types/context';

export const products = async (
  _: any,
  { page = 1, limit = 20, category, search, vendorId }: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    vendorId?: string;
  },
  { prisma }: Context
) => {
  const skip = (page - 1) * limit;
  
  const where: any = {
    isActive: true,
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        variants: {
          where: { isActive: true },
        },
        vendorProducts: {
          where: { 
            isActive: true,
            ...(vendorId ? { vendorId } : {}),
          },
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                logo: true,
                rating: true,
              },
            },
            prices: {
              where: { isActive: true },
              include: {
                variant: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  const edges = products.map((product, index) => ({
    node: product,
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
