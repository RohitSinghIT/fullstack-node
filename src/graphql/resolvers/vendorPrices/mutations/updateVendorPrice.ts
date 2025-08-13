import { Context } from '../../../types/context';
import { UserRole } from '@prisma/client';

interface UpdateVendorPriceInput {
  price?: number;
  comparePrice?: number;
  isActive?: boolean;
}

export const updateVendorPrice = async (
  _: any,
  { id, input }: { id: string; input: UpdateVendorPriceInput },
  { prisma, user }: Context
) => {
  // Check if user is authenticated and is a vendor
  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== UserRole.VENDOR) {
    throw new Error('Only vendors can update prices');
  }

  try {
    // Verify that the vendor price belongs to the authenticated vendor
    const vendorPrice = await prisma.vendorPrice.findUnique({
      where: { id },
      include: {
        vendorProduct: {
          include: { vendor: true },
        },
      },
    });

    if (!vendorPrice) {
      throw new Error('Vendor price not found');
    }

    if (vendorPrice.vendorProduct.vendorId !== user.vendorId) {
      throw new Error('You can only update prices for your own products');
    }

    const updatedVendorPrice = await prisma.vendorPrice.update({
      where: { id },
      data: {
        price: input.price,
        comparePrice: input.comparePrice,
        isActive: input.isActive,
      },
      include: {
        vendorProduct: {
          include: {
            vendor: true,
            product: true,
          },
        },
        variant: true,
      },
    });

    return updatedVendorPrice;
  } catch (error) {
    throw new Error(`Failed to update vendor price: ${error}`);
  }
}; 