import { Context } from '../../../../types/context';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (
  _: any,
  { input }: { input: { email: string; password: string } },
  { prisma }: Context
) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  return {
    user,
    token,
  };
}; 