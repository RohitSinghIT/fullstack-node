import { Context } from '../../../../types/context';
import bcrypt from 'bcryptjs';

export const changePassword = async (
  _: any,
  { input }: { input: { currentPassword: string; newPassword: string; confirmPassword: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (input.newPassword !== input.confirmPassword) {
    throw new Error('New passwords do not match');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!currentUser) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(input.currentPassword, currentUser.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: 'Password changed successfully' };
}; 