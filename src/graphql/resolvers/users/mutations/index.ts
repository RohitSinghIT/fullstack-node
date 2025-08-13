import { createUser } from './createUser';
import { updateUser } from './updateUser';
import { deleteUser } from './deleteUser';
import { changePassword } from './changePassword';
import { toggleTwoFactor } from './toggleTwoFactor';
import { updateDataConsent } from './updateDataConsent';

export const usersMutations = {
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  toggleTwoFactor,
  updateDataConsent
};
