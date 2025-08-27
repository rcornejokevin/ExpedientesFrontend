import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    flujo: z
      .string()
      .min(1, { message: 'El flujo de la subetapa es requerido' }),
    etapa: z
      .string()
      .min(1, { message: 'La etapa de la subetapa es requerido' }),
    nombre: z
      .string()
      .min(1, { message: 'El nombre de la etapa es requerido' }),
    ayuda: z
      .string()
      .min(1, { message: 'El texto de ayuda de la etapa es requerido' }),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
