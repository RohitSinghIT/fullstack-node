import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const order = async (_: any, { id }: { id: string }) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            alternateMobile: true,
            addresses: {
              where: { isDefault: true },
            },
          },
        },
        vendor: {
          select: {
            id: true,
            storeName: true,
            storeAddress: true,
            storeImage: true,
            contactPhone: true,
          },
        },
        orderDetails: {
          include: {
            product: {
              include: {
                category: true,
                variants: true,
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
                email: true,
              },
            },
          },
        },
        returns: {
          include: {
            returnItems: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
        },
        reviewRatings: {
          include: {
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    return order;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to fetch order');
  }
};
