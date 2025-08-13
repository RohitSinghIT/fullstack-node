import { Context } from '../../../../../../types/context';

export const cancelOrder = async (_: any, { id }: { id: string }, { prisma, user }: Context) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId: user.id,
      status: 'PENDING',
    },
  });

  if (!order) {
    throw new Error('Order not found or cannot be cancelled');
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
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
  });

  return updatedOrder;
};
