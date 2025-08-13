import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const cancelOrder = async (
  _: any,
  { id, reason }: { id: string; reason?: string }
) => {
  try {
    // Check if order exists and can be cancelled
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    // Check if order can be cancelled
    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      throw new GraphQLError('Order cannot be cancelled');
    }

    // Update order status to cancelled
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        updatedAt: new Date(),
      },
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
      },
    });

    return updatedOrder;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to cancel order');
  }
};
