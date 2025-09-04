// NewSchemaType.ts
import { z } from 'zod';

export type tipo = 'Fecha' | 'Texto' | 'Numero' | 'Opcion';
interface ApiField {
  nombre: string;
  requerido: boolean;
  tipo: tipo;
  etapaId?: string;
  flujoId: string;
}

export type ApiSchemaConfig = {
  fields: ApiField[];
};

export const getNewSchema = (cfg: ApiSchemaConfig) => {
  const shape: Record<string, any> = {};
  shape['CODIGO'] = z.string().min(1, 'El codigo es requerido');
  shape['NOMBRE DE EXPEDIENTE'] = z.string().min(1, 'El nombre es requerido');
  shape['FECHA DE INGRESO'] = z.string();
  shape['TIPO DE PROCESO'] = z.string().min(1, 'El flujo es requerido');
  shape['ESTATUS ACTUAL'] = z.string().min(1, 'La etapa es requerida');
  shape['SUB-ETAPA ACTUAL'] = z.string().optional();
  shape['ASESOR ASIGNADO'] = z.string();
  for (const f of cfg.fields) {
    let s;
    if (f.tipo === 'Fecha') {
      s = z.string();
    }
    if (f.tipo === 'Texto') {
      s = z.string();
    }
    if (f.tipo === 'Numero') {
      s = z.number();
    }
    if (s !== undefined && !f.requerido) {
      s = s.optional();
    }
    shape[f.nombre] = s;
  }

  return z.object(shape);
};

export type NewSchemaTypeFrom<C extends ApiSchemaConfig> = z.infer<
  ReturnType<typeof getNewSchema>
>;
