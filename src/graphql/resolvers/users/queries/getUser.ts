import { Context } from '../../../../types/context';

export const getUser = async (_: any, { id }: { id: string }, { prisma }: Context) => {
      return await prisma.user.findUnique({
      where: { id },
    });
}; 