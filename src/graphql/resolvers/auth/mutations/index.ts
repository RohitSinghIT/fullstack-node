import { login } from './login';
import { signup } from './signup';
import { logout } from './logout';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { changePassword } from './changePassword';
import { acceptPrivacyPolicy } from './acceptPrivacyPolicy';

export const authMutations = {
  login,
  signup,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  acceptPrivacyPolicy,
}; 