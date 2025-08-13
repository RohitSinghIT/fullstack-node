import { Context } from '../../../../types/context';

export const me = async (_: any, __: any, { prisma, user }: Context) => {
  if (!user) throw new Error('Not authenticated');
  
      return await prisma.user.findUnique({
      where: { id: user.id },
    });
}; 