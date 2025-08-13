import { Context } from '../../../../types/context';
import bcrypt from 'bcryptjs';

export const resetPassword = async (
  _: any,
  { input }: { input: { token: string; newPassword: string; confirmPassword: string } },
  { prisma }: Context
) => {
  if (input.newPassword !== input.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // TODO: Verify reset token and get user
  // For now, this is a placeholder implementation
  throw new Error('Password reset functionality not implemented yet');
}; 