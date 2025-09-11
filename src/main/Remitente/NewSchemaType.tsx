import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    descripcion: z.string().min(1, { message: 'La descripcion es requerida' }),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
