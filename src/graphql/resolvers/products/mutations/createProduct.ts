import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const createProduct = async (_: any, { input }: { input: any }, context: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        tenantId: context.user.tenantId,
        cacheVersion: 1,
        lastCacheUpdate: new Date(),
        name: input.name,
        productHindiName: input.productHindiName,
        type: input.type,
        upc: input.upc,
        tax: input.tax || 0,
        cess: input.cess || 0,
        cgst: input.cgst || 0,
        sgst: input.sgst || 0,
        availability: input.availability || 'In Stock',
        rating: 0,
        sku: input.sku,
        hsnCode: input.hsnCode,
        brand: input.brand,
        coverImage: input.coverImage,
        status: input.status || 'ACTIVE',
        featured: input.featured || false,
        searchTags: input.searchTags,
        seoUrl: input.seoUrl,
        orderIndex: 0,
        cancellation: input.cancellation || 'ALLOWED',
        return: input.return || 'ALLOWED',
        returnDays: input.returnDays || 7,
        isCodAllowed: input.isCodAllowed || true,
        isDeleted: false,
        createdById: BigInt(context.user.id),
      },
      include: {
        createdBy: true,
        categoryLinks: {
          include: {
            category: true,
          },
        },
        variants: {
          include: {
            vendorProduct: {
              include: {
                vendor: true,
              },
            },
            category: true,
          },
        },
        vendorProducts: {
          include: {
            vendor: true,
            variants: true,
          },
        },
        orderDetails: true,
        returns: true,
        reviewRatings: true,
        features: true,
      },
    });

    return product;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to create product');
  }
};
