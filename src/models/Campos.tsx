import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemCampo {
  id?: string;
  nombre: string;
  tipo?: string;
  etapa?: string;
  subEtapa?: string;
  orden?: number;
  requerido: boolean;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'campo/list', jwt);
  return await response.json();
};
const New = async (jwt: string, obj: ItemCampo) => {
  const newObj = {
    nombre: obj.nombre,
    orden: obj.orden,
    etapaId: Number.parseInt(obj.etapa ?? '0'),
    subEtapaId:
      obj.subEtapa == 'all' ? 0 : Number.parseInt(obj.subEtapa ?? '0'),
    requerido: obj.requerido,
    tipoCampo: obj.tipo,
  };
  try {
    const response: any = await sendPost(newObj, 'campo/add', true, jwt);
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
const Edit = async (jwt: string, item: ItemCampo) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    etapaId: Number.parseInt(item.etapa ?? '0'),
    subEtapaId:
      item.subEtapa == 'all' ? 0 : Number.parseInt(item.subEtapa ?? '0'),
    requerido: item.requerido,
    tipoCampo: item.tipo,
  };
  try {
    const response: any = await sendPut(newObj, 'campo/edit', true, jwt);
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
const Orden = async (jwt: string, orden: any) => {
  try {
    const response: any = await sendPut(orden, 'campo/orden', true, jwt);
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
const Delete = async (jwt: string, id: number) => {
  try {
    const response: any = await sendDelete(id, 'campo', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit, Orden };
