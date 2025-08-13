import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const updateVendor = async (
  _: any,
  { id, input }: { id: string; input: any }
) => {
  try {
    // Check if vendor exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      throw new GraphQLError('Vendor not found');
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        storeName: input.storeName,
        storeAddress: input.storeAddress,
        storeImage: input.storeImage,
        storeUrl: input.storeUrl,
        gstNumber: input.gstNumber,
        fssai: input.fssai,
        cia: input.cia,
        panNumber: input.panNumber,
        bankAccountNumber: input.bankAccountNumber,
        bankIfsc: input.bankIfsc,
        bankBranch: input.bankBranch,
        bankName: input.bankName,
        commissionType: input.commissionType,
        commissionRate: input.commissionRate,
        status: input.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return vendor;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to update vendor');
  }
};
