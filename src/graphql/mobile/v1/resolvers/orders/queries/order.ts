import { Context } from '../../../../../../types/context';

export const order = async (_: any, { id }: { id: string }, { prisma, user }: Context) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId: user.id,
    },
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
          contactPhone: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};
