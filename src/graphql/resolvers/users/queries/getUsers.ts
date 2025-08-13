import { Context } from '../../../../types/context';

export const getUsers = async (_: any, __: any, { prisma }: Context) => {
      return await prisma.user.findMany();
}; 