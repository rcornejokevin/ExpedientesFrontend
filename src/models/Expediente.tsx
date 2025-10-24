import { sendGet, sendPost, sendPut } from '@/lib/apiRequest';

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
  REMITENTE: string;
  ASUNTO: string;
  PDF_EXPEDIENTE?: any;
  expedienteRelacionadoId?: string;
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
export interface ExpedienteListFilters {
  limit?: number | '';
  fechaInicioIngreso?: string;
  fechaFinIngreso?: string;
  fechaInicioActualizacion?: string;
  fechaFinActualizacion?: string;
  asesorId?: number;
  flujoId?: number;
  etapaId?: number;
  subEtapaId?: number;
  estatus?: string;
  asunto?: string;
  remitenteId?: number;
}

const GetList = async (
  jwt: string,
  filters?: ExpedienteListFilters,
  reporteId?: number,
) => {
  const params: Record<string, any> = {
    limit: filters?.limit,
    fechaInicioIngreso: filters?.fechaInicioIngreso ?? '',
    fechaFinIngreso: filters?.fechaFinIngreso ?? '',
    fechaInicioActualizacion: filters?.fechaInicioActualizacion ?? '',
    fechaFinActualizacion: filters?.fechaFinActualizacion ?? '',
    asesorId: filters?.asesorId ?? 0,
    flujoId: filters?.flujoId ?? 0,
    etapaId: filters?.etapaId ?? 0,
    subEtapaId: filters?.subEtapaId ?? 0,
    estatus: filters?.estatus ?? '',
    asunto: filters?.asunto ?? '',
    remitenteId: filters?.remitenteId ?? 0,
    reporteId: reporteId ?? 0,
  };
  const response = await sendGet(params, 'cases/list', jwt);
  return response;
};
const GetListDetails = async (jwt: string, id: number, header: number = 1) => {
  const response = await sendGet('', `cases/detail/${id}/${header}`, jwt);
  return response;
};
const GetListNotes = async (jwt: string, id: number) => {
  const response = await sendGet('', `cases/notes/${id}`, jwt);
  return response;
};
const AddNote = async (jwt: string, obj: any) => {
  try {
    const response: any = await sendPost(obj, 'cases/note', true, jwt);
    if (response.code === '400' && response.data != null) {
      const data = response.data;
      let errorsString = '';
      if (Array.isArray(data)) {
        errorsString = data.join(' | ');
      } else if (typeof data === 'object') {
        errorsString = Object.values(data)
          .map((messages: any) =>
            Array.isArray(messages) ? messages.join(', ') : String(messages),
          )
          .join(' | ');
      } else {
        errorsString = String(data);
      }
      response.message += `: ${errorsString}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};
const GetItem = async (jwt: string, id: number) => {
  const response = await sendGet('', `cases/${id}`, jwt);
  return response;
};
const GetItemExpedienteList = async (
  jwt: string,
): Promise<ItemExpediente[]> => {
  const response = await GetList(jwt);
  if (response.code === '000') {
    const data = response.data;
    const mapped: ItemExpediente[] = data.map((f: any) => ({
      id: String(f.id),
      nombre: f.nombre,
      ayuda: f.detalle ?? '',
    }));
    return mapped;
  } else {
    throw new Error(response.message);
  }
};
const GetItemExpediente = async (
  jwt: string,
  id: number,
): Promise<ItemExpediente[]> => {
  const response = await GetItem(jwt, id);
  if (response.code === '000') {
    return response.data;
  } else {
    throw new Error(response.message);
  }
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
    flujoId: Number(obj['TIPO DE PROCESO']),
    codigo: obj['CODIGO'],
    nombre: obj['NOMBRE DE EXPEDIENTE'],
    nombreArchivo: obj.PDF_EXPEDIENTE ? obj.PDF_EXPEDIENTE.name : '',
    fechaIngreso: obj['FECHA DE INGRESO'],
    asesor: obj['ASESOR ASIGNADO'],
    remitenteId: Number.parseInt(obj['REMITENTE']),
    asunto: obj['ASUNTO'],
    archivo: obj.PDF_EXPEDIENTE ? await fileToBase64(obj.PDF_EXPEDIENTE) : '',
    campos: JSON.stringify(obj.camposAdicionales) || '',
    expedienteRelacionadoId: Number.parseInt(
      obj['expedienteRelacionadoId'] || '0',
    ),
  };
  try {
    const response: any = await sendPost(newObj, 'cases/add', true, jwt);
    if (response.code === '400' && response.data != null) {
      const data = response.data;
      let errorsString = '';
      if (Array.isArray(data)) {
        errorsString = data.join(' | ');
      } else if (typeof data === 'object') {
        errorsString = Object.values(data)
          .map((messages: any) =>
            Array.isArray(messages) ? messages.join(', ') : String(messages),
          )
          .join(' | ');
      } else {
        errorsString = String(data);
      }
      response.message += `: ${errorsString}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};
const Indicators = async (jwt: string) => {
  try {
    return await sendGet('', 'cases/indicators', jwt);
  } catch (error) {
    throw error;
  }
};
const Edit = async (jwt: string, obj: any) => {
  try {
    const objToSend = {
      ...obj,
      archivo: obj.archivo ? await fileToBase64(obj.archivo) : '',
      nombreArchivo: obj.archivo ? obj.archivo.name : '',
    };
    const response: any = await sendPut(objToSend, 'cases/edit', true, jwt);
    if (response.code === '400' && response.data != null) {
      const data = response.data;
      let errorsString = '';
      if (Array.isArray(data)) {
        errorsString = data.join(' | ');
      } else if (typeof data === 'object') {
        errorsString = Object.values(data)
          .map((messages: any) =>
            Array.isArray(messages) ? messages.join(', ') : String(messages),
          )
          .join(' | ');
      } else {
        errorsString = String(data);
      }
      response.message += `: ${errorsString}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};
const ChangeStatus = async (jwt: string, id: number, status: string) => {
  try {
    const objToSend = {
      id,
      state: status,
    };
    const response: any = await sendPut(
      objToSend,
      'cases/editState',
      true,
      jwt,
    );
    if (response.code === '400' && response.data != null) {
      const data = response.data;
      let errorsString = '';
      if (Array.isArray(data)) {
        errorsString = data.join(' | ');
      } else if (typeof data === 'object') {
        errorsString = Object.values(data)
          .map((messages: any) =>
            Array.isArray(messages) ? messages.join(', ') : String(messages),
          )
          .join(' | ');
      } else {
        errorsString = String(data);
      }
      response.message += `: ${errorsString}`;
    }
    return response;
  } catch (error) {
    throw error;
  }
};
const GetFile = async (jwt: string, id: number) => {
  const response = await sendGet('', `cases/document/${id}`, jwt);
  return await response;
};
const GetFileDetail = async (jwt: string, id: number) => {
  const response = await sendGet('', `cases/document_detail/${id}`, jwt);
  return await response;
};
export {
  GetList,
  New,
  GetItemExpedienteList,
  GetItemExpediente,
  Edit,
  GetFile,
  GetFileDetail,
  GetListDetails,
  Indicators,
  ChangeStatus,
  GetListNotes,
  AddNote,
};
