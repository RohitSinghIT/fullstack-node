import { Context } from '../../../../../../types/context';

export const updateProfile = async (
  _: any,
  { input }: { input: { name?: string; phone?: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: input.name,
      phone: input.phone,
    },
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    phone: updatedUser.phone,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt.toISOString(),
  };
};
