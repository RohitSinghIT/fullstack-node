import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const updateProduct = async (_: any, { id, input }: { id: string; input: any }, context: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new GraphQLError('Authentication required');
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingProduct || existingProduct.isDeleted) {
      throw new GraphQLError('Product not found');
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        name: input.name,
        productHindiName: input.productHindiName,
        type: input.type,
        upc: input.upc,
        tax: input.tax,
        cess: input.cess,
        cgst: input.cgst,
        sgst: input.sgst,
        availability: input.availability,
        sku: input.sku,
        hsnCode: input.hsnCode,
        brand: input.brand,
        coverImage: input.coverImage,
        status: input.status,
        featured: input.featured,
        searchTags: input.searchTags,
        seoUrl: input.seoUrl,
        cancellation: input.cancellation,
        return: input.return,
        returnDays: input.returnDays,
        isCodAllowed: input.isCodAllowed,
        lastCacheUpdate: new Date(),
        cacheVersion: existingProduct.cacheVersion + 1,
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
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      throw new GraphQLError('Product not found');
    }
    throw new GraphQLError('Failed to update product');
  }
};
