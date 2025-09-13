import { z } from 'zod';

// Esquema para filtros del reporte
export const getNewSchema = () => {
  return z.object({
    limit: z
      .number({ invalid_type_error: 'El límite debe ser número' })
      .int()
      .min(1, { message: 'El límite mínimo es 1' })
      .default(100),

    fechaInicioIngreso: z.string().optional().default(''),
    fechaFinIngreso: z.string().optional().default(''),

    fechaInicioActualizacion: z.string().optional().default(''),
    fechaFinActualizacion: z.string().optional().default(''),

    asesorId: z
      .number({ invalid_type_error: 'El asesorId debe ser número' })
      .int()
      .nonnegative()
      .optional()
      .default(0),
    flujoId: z
      .number({ invalid_type_error: 'El flujoId debe ser número' })
      .int()
      .nonnegative()
      .optional()
      .default(0),
    etapaId: z
      .number({ invalid_type_error: 'El etapaId debe ser número' })
      .int()
      .nonnegative()
      .optional()
      .default(0),
    subEtapaId: z
      .number({ invalid_type_error: 'El subEtapaId debe ser número' })
      .int()
      .nonnegative()
      .optional()
      .default(0),
    remitenteId: z
      .number({ invalid_type_error: 'El remitenteId debe ser número' })
      .int()
      .nonnegative()
      .optional()
      .default(0),

    // Otros filtros (cadena vacía = sin filtro)
    estatus: z.string().optional().default(''),
    asunto: z.string().optional().default(''),
  });
};

export type newSchemaType = z.infer<ReturnType<typeof getNewSchema>>;
