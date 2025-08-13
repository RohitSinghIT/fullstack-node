import { Context } from '../../../../../../types/context';

export const createReview = async (
  _: any,
  { input }: { input: { productId?: string; vendorId?: string; rating: number; comment?: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const { productId, vendorId, rating, comment } = input;

  if (!productId && !vendorId) {
    throw new Error('Either productId or vendorId is required');
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      productId,
      vendorId,
      rating,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};
