import { useAuth } from '@/auth/AuthContext';
import { z } from 'zod';

export type tipo =
  | 'Fecha'
  | 'Texto'
  | 'Numero'
  | 'Opciones'
  | 'Cheque'
  | 'Memo';
interface ApiField {
  nombre: string;
  requerido: boolean;
  tipo: tipo;
  etapaId?: string;
  flujoId: string;
  label: string;
  placeholder?: string;
  opciones?: string;
  id?: string;
}

export type ApiSchemaConfig = {
  fields: ApiField[];
};

export const getEditSchema = (cfg: ApiSchemaConfig) => {
  const { user } = useAuth();
  let shape: Record<string, any> = {};
  shape['etapa'] = z.string().min(1, { message: 'La etapa es requerida' });
  shape['asesor'] = z.string().min(1, { message: 'El asesor es requerido' });
  shape['subEtapa'] = z.string();
  if (user?.perfil === 'ADMINISTRADOR' || user?.perfil === 'DIRECTOR') {
    shape['ASUNTO'] = z
      .string({ required_error: 'El asunto es requerido' })
      .min(1, 'El asunto es requerido');
    shape['REMITENTE'] = z
      .string({ required_error: 'El remitente es requerido' })
      .min(1, 'El remitente es requerido');
    shape['NOMBRE DE EXPEDIENTE'] = z
      .string({ required_error: 'El nombre es requerido' })
      .min(1, 'El nombre es requerido');
    shape['FECHA DE INGRESO'] = z
      .string({
        required_error: 'La fecha de ingreso es requerida',
      })
      .min(1, 'La fecha de ingreso es requerida');
    shape['EXPEDIENTE RELACIONADO'] = z.string().optional();
  }
  shape['aniadirArchivo'] = z.boolean().optional();
  shape['PDF_EXPEDIENTE'] = z
    .union([z.undefined(), z.null(), z.any()])
    .refine((f) => f == null || f instanceof File, {
      message: 'Debe adjuntar un archivo válido',
    })
    .refine((f: any) => f == null || (f as File)?.type === 'application/pdf', {
      message: 'El archivo debe ser un PDF',
    });
  for (const f of cfg.fields) {
    const req = f.requerido
      ? { required_error: `El campo ${f.nombre} es requerido` }
      : {};
    let s: any;
    if (f.tipo === 'Fecha') {
      s = z.string(req);
      if (f.requerido) s = s.min(1, `El campo ${f.nombre} es requerido`);
    } else if (f.tipo === 'Texto') {
      s = z.string(req);
      if (f.requerido) s = s.min(1, `El campo ${f.nombre} es requerido`);
    } else if (f.tipo === 'Numero') {
      s = z.coerce.number(req);
      if (f.requerido)
        s = s.refine(
          (n: number) => !Number.isNaN(n),
          `El campo ${f.nombre} es requerido`,
        );
    } else if (f.tipo === 'Opciones') {
      s = z.string(req);
      if (f.requerido) s = s.min(1, `El campo ${f.nombre} es requerido`);
    } else if (f.tipo === 'Cheque') {
      s = z.boolean(req);
    } else {
      s = z.any(req);
    }
    if (!f.requerido) {
      s = s.optional();
    }
    shape[f.nombre] = s;
  }

  shape['FECHA DE ÚLTIMA ETAPA'] = z.string().optional();

  return z.object(shape);
};

export type EditSchemaTypeFrom<C extends ApiSchemaConfig> = z.infer<
  ReturnType<typeof getEditSchema>
>;
