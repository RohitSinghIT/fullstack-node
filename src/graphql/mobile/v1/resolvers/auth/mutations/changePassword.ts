import { Context } from '../../../../../../types/context';
import bcrypt from 'bcryptjs';

export const changePassword = async (_: any, { input }: { input: { currentPassword: string; newPassword: string } }, { user, prisma }: Context) => {
  if (!user) {
    throw new Error('Authentication required');
  }

  // Get current user with password
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });

  if (!currentUser) {
    throw new Error('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(input.currentPassword, currentUser.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(input.newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  return true;
};
