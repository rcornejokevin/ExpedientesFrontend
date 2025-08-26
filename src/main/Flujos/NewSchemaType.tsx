import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    nombre: z.string().min(1, { message: 'El nombre del flujo es requerido' }),
    ayuda: z.string().min(1, { message: 'El texto de ayuda es requerido' }),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
