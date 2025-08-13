import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const updateOrder = async (
  _: any,
  { id, input }: { id: string; input: any }
) => {
  try {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new GraphQLError('Order not found');
    }

    // Prepare update data
    const updateData: any = {};

    if (input.deliveryBoyId !== undefined) updateData.deliveryBoyId = input.deliveryBoyId;
    if (input.addressId !== undefined) updateData.addressId = input.addressId;
    if (input.shippingCharges !== undefined) updateData.shippingCharges = input.shippingCharges;
    if (input.tax !== undefined) updateData.tax = input.tax;
    if (input.promoCodeId !== undefined) updateData.promoCodeId = input.promoCodeId;
    if (input.discount !== undefined) updateData.discount = input.discount;
    if (input.amount !== undefined) updateData.amount = input.amount;
    if (input.paymentMethod !== undefined) updateData.paymentMethod = input.paymentMethod;
    if (input.cancellationReason !== undefined) updateData.cancellationReason = input.cancellationReason;
    if (input.partialCancelReason !== undefined) updateData.partialCancelReason = input.partialCancelReason;
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.review !== undefined) updateData.review = input.review;
    if (input.tip !== undefined) updateData.tip = input.tip;
    if (input.deliveredAt !== undefined) updateData.deliveredAt = input.deliveredAt;
    if (input.shippedAt !== undefined) updateData.shippedAt = input.shippedAt;
    if (input.customerNotes !== undefined) updateData.customerNotes = input.customerNotes;
    if (input.vendorNotes !== undefined) updateData.vendorNotes = input.vendorNotes;
    if (input.estimatedDeliveryTime !== undefined) updateData.estimatedDeliveryTime = input.estimatedDeliveryTime;
    if (input.actualDeliveryTime !== undefined) updateData.actualDeliveryTime = input.actualDeliveryTime;
    if (input.deliverySlotStart !== undefined) updateData.deliverySlotStart = input.deliverySlotStart;
    if (input.deliverySlotEnd !== undefined) updateData.deliverySlotEnd = input.deliverySlotEnd;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    return order;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to update order');
  }
};
