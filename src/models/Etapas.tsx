import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemEtapa {
  id?: string;
  nombre: string;
  ayuda?: string;
  flujo?: string;
  orden?: number;
}
export interface ListaOrden {
  id?: string;
  orden?: number;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'etapa/list', jwt);
  return await response;
};
const New = async (jwt: string, obj: ItemEtapa) => {
  const newObj = {
    nombre: obj.nombre,
    orden: obj.orden,
    detalle: obj.ayuda,
    flujoId: obj.flujo,
  };
  try {
    const response: any = await sendPost(newObj, 'etapa/add', true, jwt);
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
const Edit = async (jwt: string, item: ItemEtapa) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    detalle: item.ayuda,
    flujoId: item.flujo,
  };
  try {
    const response: any = await sendPut(newObj, 'etapa/edit', true, jwt);
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
    const response: any = await sendPut(orden, 'etapa/orden', true, jwt);
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
    const response: any = await sendDelete(id, 'etapa', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit, Orden };
