import { z } from 'zod';

export const getEditSchema = () => {
  return z.object({
    etapa: z.string().min(1, { message: 'La etapa del campo es requerido' }),
    subEtapa: z.string(),
    aniadirArchivo: z.boolean().optional(),
    PDF_EXPEDIENTE: z
      .union([z.undefined(), z.null(), z.any()])
      .refine((f) => f == null || f instanceof File, {
        message: 'Debe adjuntar un archivo válido',
      })
      .refine(
        (f: any) => f == null || (f as File)?.type === 'application/pdf',
        {
          message: 'El archivo debe ser un PDF',
        },
      ),
  });
};

export type editSchemaType = z.infer<ReturnType<typeof getEditSchema>>;
