import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    flujo: z.string().min(1, { message: 'El flujo del campo es requerido' }),
    etapa: z.string().min(1, { message: 'La etapa del campo es requerido' }),
    subEtapa: z
      .string()
      .min(1, { message: 'La subetapa del campo es requerido' }),
    nombre: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    tipo: z.string().min(1, { message: 'El nombre del campo es requerido' }),
    requerido: z.boolean().optional(),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
