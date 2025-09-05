import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    flujo: z.string().min(1, { message: 'El flujo del campo es requerido' }),
    nombre: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    tipo: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    placeholder: z
      .string()
      .min(1, { message: 'El placeholder del campo es requerido' }),
    label: z.string().min(1, { message: 'El label del campo es requerido' }),
    opciones: z.string().optional(),
    requerido: z.boolean().optional(),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
