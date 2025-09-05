import { sendGet, sendPost } from '@/lib/apiRequest';

export interface ItemExpediente {
  id?: string;
  CODIGO: string;
  'ESTATUS ACTUAL'?: string;
  'FECHA DE INGRESO'?: string;
  'FECHA DE ÚLTIMA ETAPA'?: number;
  'NOMBRE DE EXPEDIENTE': string;
  'TIPO DE PROCESO': string;
  'ASESOR ASIGNADO'?: string;
  'SUB-ETAPA ACTUAL'?: string;
  camposAdicionales?: Record<string, any>;
  PDF_EXPEDIENTE?: any;
}
export interface ListaOrden {
  id?: string;
  orden?: number;
}
export interface CampoConValor {
  tipoCampo: string;
  valor?: string;
  label: string;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'cases/list', jwt);
  return await response;
};
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // convierte a base64 con prefijo "data:*/*;base64,"
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
const New = async (jwt: string, obj: ItemExpediente) => {
  const newObj = {
    etapaId: Number(obj['TIPO DE PROCESO']),
    subEtapaId:
      obj['SUB-ETAPA ACTUAL'] == '[SIN PRIMERA SUB-ETAPA]'
        ? 0
        : Number(obj['SUB-ETAPA ACTUAL']),
    codigo: obj['CODIGO'],
    nombre: obj['NOMBRE DE EXPEDIENTE'],
    nombreArchivo: obj.PDF_EXPEDIENTE ? obj.PDF_EXPEDIENTE.name : '',
    fechaIngreso: obj['FECHA DE INGRESO'],
    asesor: obj['ASESOR ASIGNADO'],
    archivo: obj.PDF_EXPEDIENTE ? await fileToBase64(obj.PDF_EXPEDIENTE) : '',
    campos: JSON.stringify(obj.camposAdicionales) || '',
  };
  try {
    const response: any = await sendPost(newObj, 'cases/add', true, jwt);
    if (response.code === '400') {
      const errorsString = Object.entries(response.data)
        .map(([field, messages]) => ` ${(messages as string[]).join(', ')}`)
        .join(' | ');
      response.message += `: ${errorsString}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New };
