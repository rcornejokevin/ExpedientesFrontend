import { z } from 'zod';

export const getSigninSchema = () => {
  return z.object({
    usuario: z
      .string()
      .min(1, { message: 'Usuario es requerido' }),
    password: z.string().min(1, { message: 'Contraseña es requerida.' }),
  });
};

export type SigninSchemaType = z.infer<ReturnType<typeof getSigninSchema>>;
