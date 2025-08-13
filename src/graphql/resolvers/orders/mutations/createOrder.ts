import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const createOrder = async (
  _: any,
  { input }: { input: any }
) => {
  try {
    const {
      customerId,
      vendorId,
      deliveryBoyId,
      addressId,
      shippingCharges = 0,
      tax = 0,
      promoCodeId,
      discount = 0,
      amount,
      paymentMethod,
      customerNotes,
      vendorNotes,
      orderDetails,
    } = input;

    // Validate customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new GraphQLError('Customer not found');
    }

    // Validate vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new GraphQLError('Vendor not found');
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderDetailInputs = [];

    for (const detail of orderDetails) {
      const { vendorProductId, productId, variantId, quantity, rate, marketRate } = detail;
      
      // Validate vendor product
      const vendorProduct = await prisma.vendorProduct.findUnique({
        where: { id: vendorProductId },
      });

      if (!vendorProduct) {
        throw new GraphQLError(`Vendor product ${vendorProductId} not found`);
      }

      const itemTotal = rate * quantity;
      totalAmount += itemTotal;

      orderDetailInputs.push({
        vendorProductId,
        productId,
        variantId,
        quantity,
        rate,
        marketRate,
      });
    }

    // Add shipping charges, tax, and subtract discount
    const finalAmount = totalAmount + shippingCharges + tax - discount;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId,
        vendorId,
        deliveryBoyId,
        addressId,
        shippingCharges,
        tax,
        promoCodeId,
        discount,
        amount: finalAmount,
        paymentMethod,
        customerNotes,
        vendorNotes,
        orderDetails: {
          create: orderDetailInputs,
        },
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

    return order;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to create order');
  }
};
