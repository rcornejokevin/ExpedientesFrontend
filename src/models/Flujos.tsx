import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemFlujo {
  id?: string;
  nombre: string;
  ayuda?: string;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'flujo/list', jwt);
  return await response.json();
};
const New = async (jwt: string, nombre: string, detalle: string) => {
  const newObj = {
    nombre,
    detalle,
  };
  try {
    const response: any = await sendPost(newObj, 'flujo/add', true, jwt);
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
const Edit = async (jwt: string, item: ItemFlujo) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    detalle: item.ayuda,
  };
  try {
    const response: any = await sendPut(newObj, 'flujo/edit', true, jwt);
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
    const response: any = await sendDelete(id, 'flujo', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit };
