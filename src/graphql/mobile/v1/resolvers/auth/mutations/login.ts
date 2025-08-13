import { Context } from '../../../../../../types/context';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (_: any, { input }: { input: { email: string; password: string } }, { prisma }: Context) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      vendor: true,
      team: true,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
};
