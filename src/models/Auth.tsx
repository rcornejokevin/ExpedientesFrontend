import { sendPut } from '@/lib/apiRequest';

export const approveTwoFactor = async (token: string) => {
  const body = { token };
  return await sendPut(body, 'seguridad/twofactor', false);
};

