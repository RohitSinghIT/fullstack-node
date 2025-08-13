import { Context } from '../../../../../../types/context';

export const sendOtp = async (_: any, { phoneNumber }: { phoneNumber: string }, { prisma }: Context) => {
  // Clean phone number (remove +91 and spaces)
  const cleanedPhone = phoneNumber.replace(/\D/g, '');
  
  if (cleanedPhone.length !== 12 || !cleanedPhone.startsWith('91')) {
    throw new Error('Invalid phone number format. Please use +91 format.');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in Redis (you can use database as fallback)
  // For now, we'll simulate OTP storage
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  
  // TODO: Integrate with SMS service to send OTP
  // For development, we'll just return success
  
  return {
    success: true,
    message: 'OTP sent successfully',
  };
};
