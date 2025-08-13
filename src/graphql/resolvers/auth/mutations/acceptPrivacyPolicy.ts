import { Context } from '../../../../types/context';

export const acceptPrivacyPolicy = async (
  _: any,
  { input }: { input: { accepted: boolean } },
  { prisma, user }: Context
) => {
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!input.accepted) {
    throw new Error('Privacy policy must be accepted');
  }

  // TODO: Add privacy policy acceptance field to user model
  // For now, just return success
  return { success: true, message: 'Privacy policy accepted' };
}; 