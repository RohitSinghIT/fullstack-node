import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const createVendor = async (
  _: any,
  { input }: { input: any }
) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new GraphQLError('User not found');
    }

    // Check if vendor already exists for this user
    const existingVendor = await prisma.vendor.findFirst({
      where: { userId: input.userId },
    });

    if (existingVendor) {
      throw new GraphQLError('Vendor already exists for this user');
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: input.userId,
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
        status: input.status || 'PENDING',
        prApproval: false,
        totalProducts: 0,
        totalOrders: 0,
        totalEarnings: 0,
        rating: 0,
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
    throw new GraphQLError('Failed to create vendor');
  }
};
