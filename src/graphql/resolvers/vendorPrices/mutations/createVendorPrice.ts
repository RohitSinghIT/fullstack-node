import { Context } from '../../../types/context';
import { UserRole } from '@prisma/client';

interface CreateVendorPriceInput {
  vendorProductId: string;
  variantId?: string;
  price: number;
  comparePrice?: number;
}

export const createVendorPrice = async (
  _: any,
  { input }: { input: CreateVendorPriceInput },
  { prisma, user }: Context
) => {
  // Check if user is authenticated and is a vendor
  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== UserRole.VENDOR) {
    throw new Error('Only vendors can set prices');
  }

  try {
    // Verify that the vendor product belongs to the authenticated vendor
    const vendorProduct = await prisma.vendorProduct.findUnique({
      where: { id: input.vendorProductId },
      include: { vendor: true },
    });

    if (!vendorProduct) {
      throw new Error('Vendor product not found');
    }

    if (vendorProduct.vendorId !== user.vendorId) {
      throw new Error('You can only set prices for your own products');
    }

    const vendorPrice = await prisma.vendorPrice.create({
      data: {
        vendorProductId: input.vendorProductId,
        variantId: input.variantId,
        price: input.price,
        comparePrice: input.comparePrice,
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

    return vendorPrice;
  } catch (error) {
    throw new Error(`Failed to create vendor price: ${error}`);
  }
}; 