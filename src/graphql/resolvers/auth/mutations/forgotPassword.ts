import { Context } from '../../../../types/context';

export const forgotPassword = async (
  _: any,
  { input }: { input: { email: string } },
  { prisma }: Context
) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    // Don't reveal if user exists or not for security
    return { success: true, message: 'If an account exists, a reset email has been sent.' };
  }

  // TODO: Implement email sending logic
  // For now, just return success
  return { success: true, message: 'If an account exists, a reset email has been sent.' };
}; 