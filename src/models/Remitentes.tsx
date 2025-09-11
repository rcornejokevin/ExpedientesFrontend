import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface Remitente {
  id?: number;
  descripcion: string;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'remitente/list', jwt);
  return await response;
};
const New = async (jwt: string, obj: Remitente) => {
  const newObj = {
    descripcion: obj.descripcion,
  };
  try {
    const response: any = await sendPost(newObj, 'remitente/add', true, jwt);
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
const Edit = async (jwt: string, item: Remitente) => {
  const newObj = {
    id: item.id,
    descripcion: item.descripcion,
  };
  try {
    const response: any = await sendPut(newObj, 'remitente/edit', true, jwt);
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
    const response: any = await sendDelete(id, 'remitente', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit };
