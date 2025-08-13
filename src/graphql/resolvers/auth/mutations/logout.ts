import { Context } from '../../../../types/context';

export const logout = async (_: any, __: any, { res }: Context) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return true
  return true;
}; 