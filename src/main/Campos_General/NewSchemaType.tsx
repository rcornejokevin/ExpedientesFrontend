import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    flujo: z.string().min(1, { message: 'El flujo del campo es requerido' }),
    nombre: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    tipo: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    requerido: z.boolean().optional(),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
