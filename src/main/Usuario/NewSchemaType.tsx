import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    username: z.string().min(1, { message: 'El username es requerido' }),
    perfil: z.string().min(1, { message: 'El perfil es requerido' }),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
