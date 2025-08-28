import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface Usuario {
  id?: string;
  username: string;
  perfil?: string;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'usuario/list', jwt);
  return await response.json();
};
const New = async (jwt: string, obj: Usuario) => {
  const newObj = {
    username: obj.username,
    perfil: obj.perfil,
  };
  try {
    const response: any = await sendPost(newObj, 'usuario/add', true, jwt);
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
const Edit = async (jwt: string, item: Usuario) => {
  const newObj = {
    id: item.id,
    username: item.username,
    perfil: item.perfil,
  };
  try {
    const response: any = await sendPut(newObj, 'usuario/edit', true, jwt);
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
    const response: any = await sendDelete(id, 'usuario', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit };
