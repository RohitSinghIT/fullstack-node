import { Context } from '../../../../types/context';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (
  _: any,
  { input }: { input: { email: string; name: string; password: string; confirmPassword: string } },
  { prisma }: Context
) => {
  if (input.password !== input.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      password: hashedPassword,
    },
  });

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