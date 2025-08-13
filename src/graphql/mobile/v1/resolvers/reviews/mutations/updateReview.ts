import { Context } from '../../../../../../types/context';

export const updateReview = async (
  _: any,
  { id, input }: { id: string; input: { rating?: number; comment?: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const { rating, comment } = input;

  if (rating && (rating < 1 || rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  const review = await prisma.review.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: {
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

  return updatedReview;
};
