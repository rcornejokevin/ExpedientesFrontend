import { z } from 'zod';

export const getNewNoteSchema = () => {
  return z.object({
    nota: z.string().min(1, { message: 'La nota es requerida' }),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewNoteSchema>>;
