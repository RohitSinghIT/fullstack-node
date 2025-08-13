import { login } from './login';
import { register } from './register';
import { sendOtp } from './sendOtp';
import { verifyOtp } from './verifyOtp';
import { updateProfile } from './updateProfile';
import { changePassword } from './changePassword';

export const authMutations = {
  login,
  register,
  sendOtp,
  verifyOtp,
  updateProfile,
  changePassword,
};
