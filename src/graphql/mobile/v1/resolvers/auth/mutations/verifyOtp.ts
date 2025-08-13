import { Context } from '../../../../../../types/context';
import jwt from 'jsonwebtoken';

export const verifyOtp = async (_: any, { phoneNumber, otp }: { phoneNumber: string; otp: string }, { prisma }: Context) => {
  // Clean phone number
  const cleanedPhone = phoneNumber.replace(/\D/g, '');
  
  if (cleanedPhone.length !== 12 || !cleanedPhone.startsWith('91')) {
    throw new Error('Invalid phone number format');
  }

  // TODO: Verify OTP from Redis/database
  // For now, we'll simulate OTP verification
  // In production, you would check the stored OTP
  
  // Find or create user by phone number
  let user = await prisma.user.findFirst({
    where: { phone: cleanedPhone },
  });

  if (!user) {
    // Create new user if doesn't exist
    user = await prisma.user.create({
      data: {
        phone: cleanedPhone,
        email: `${cleanedPhone}@temp.com`, // Temporary email
        name: `User_${cleanedPhone.slice(-4)}`,
        role: 'CUSTOMER',
      },
    });
  }

  // Generate token
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
