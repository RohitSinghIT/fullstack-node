import { Context } from '../../../../../../types/context';

export const createOrder = async (
  _: any,
  { input }: { input: { vendorId: string; items: any[]; notes?: string; deliveryInstructions?: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const { vendorId, items, notes, deliveryInstructions } = input;

  if (!items || items.length === 0) {
    throw new Error('Items are required');
  }

  // Calculate total amount
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const { productId, variantId, quantity, price } = item;
    
    // Validate product and variant
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        throw new Error(`Variant ${variantId} not found`);
      }
    }

    const itemTotal = price * quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId,
      variantId,
      quantity,
      price,
    });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      vendorId,
      totalAmount,
      notes,
      deliveryInstructions,
      orderItems: {
        create: orderItems,
      },
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
        },
      },
    },
  });

  return order;
};
