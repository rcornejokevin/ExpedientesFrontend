import { z } from 'zod';

export const getNewSchema = () => {
  return z.object({
    correlativo: z
      .string()
      .min(1, { message: 'El correlativo del flujo es requerido' }),
    nombre: z.string().min(1, { message: 'El nombre del flujo es requerido' }),
    ayuda: z.string().min(1, { message: 'El texto de ayuda es requerido' }),
    archivado: z.boolean().optional(),
    devolucionAlRemitente: z.boolean().optional(),
    enviadoAJudicial: z.boolean().optional(),
    flujoAsociado: z.boolean().optional(),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
