import { Context } from '../../../types/context';
import { UserRole } from '@prisma/client';

export const deleteVendorPrice = async (
  _: any,
  { id }: { id: string },
  { prisma, user }: Context
) => {
  // Check if user is authenticated and is a vendor
  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== UserRole.VENDOR) {
    throw new Error('Only vendors can delete prices');
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
      throw new Error('You can only delete prices for your own products');
    }

    await prisma.vendorPrice.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    throw new Error(`Failed to delete vendor price: ${error}`);
  }
}; 