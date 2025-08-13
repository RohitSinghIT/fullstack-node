import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const deleteVendor = async (_: any, { id }: { id: string }) => {
  try {
    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: { notIn: ['DELIVERED', 'CANCELLED'] },
          },
        },
        vendorProducts: {
          where: { isActive: true },
        },
      },
    });

    if (!existingVendor) {
      throw new GraphQLError('Vendor not found');
    }

    // Check if vendor has active orders
    if (existingVendor.orders.length > 0) {
      throw new GraphQLError('Cannot delete vendor with active orders');
    }

    // Check if vendor has active products
    if (existingVendor.vendorProducts.length > 0) {
      throw new GraphQLError('Cannot delete vendor with active products');
    }

    // Delete vendor
    await prisma.vendor.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to delete vendor');
  }
};
