import { Context } from '../../../../../../types/context';
import bcrypt from 'bcryptjs';

export const changePassword = async (
  _: any,
  { input }: { input: { currentPassword: string; newPassword: string } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  const { currentPassword, newPassword } = input;

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!currentUser) {
    throw new Error('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password);
  
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return true;
};
