import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemCampo {
  id?: string;
  nombre: string;
  tipo?: string;
  etapa?: string;
  flujo?: string;
  orden?: number;
  requerido: boolean;
  label: string;
  placeHolder?: string;
  opciones?: string;
  editable?: boolean;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'campo/list', jwt);
  return await response;
};
const New = async (jwt: string, obj: ItemCampo) => {
  const newObj = {
    nombre: obj.nombre,
    orden: obj.orden,
    etapaId: obj.etapa == 'all' ? 0 : Number.parseInt(obj.etapa ?? '0'),
    flujoId: Number.parseInt(obj.flujo ?? '0'),
    requerido: obj.requerido,
    tipoCampo: obj.tipo,
    label: obj.label,
    editable: obj.editable,
    placeHolder: obj.placeHolder,
    opciones: obj.tipo == 'Opciones' ? obj.opciones : '',
  };
  try {
    const response: any = await sendPost(newObj, 'campo/add', true, jwt);
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
const Edit = async (jwt: string, item: ItemCampo) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    etapaId: item.etapa == 'all' ? 0 : Number.parseInt(item.etapa ?? '0'),
    flujoId: Number.parseInt(item.flujo ?? '0'),
    requerido: item.requerido,
    tipoCampo: item.tipo,
    label: item.label,
    placeHolder: item.placeHolder,
    editable: item.editable,
    opciones: item.tipo == 'Opciones' ? item.opciones : '',
  };
  try {
    const response: any = await sendPut(newObj, 'campo/edit', true, jwt);
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
const Orden = async (jwt: string, orden: any) => {
  try {
    const response: any = await sendPut(orden, 'campo/orden', true, jwt);
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
const Delete = async (jwt: string, id: number) => {
  try {
    const response: any = await sendDelete(id, 'campo', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit, Orden };
