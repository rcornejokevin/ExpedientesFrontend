import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface Usuario {
  id?: string;
  username: string;
  perfil?: string;
  operativo: boolean;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'usuario/list', jwt);
  return await response;
};
const New = async (jwt: string, obj: Usuario) => {
  const newObj = {
    username: obj.username,
    perfil: obj.perfil,
    operativo: obj.operativo,
  };
  try {
    const response: any = await sendPost(newObj, 'usuario/add', true, jwt);
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
const Edit = async (jwt: string, item: Usuario) => {
  const newObj = {
    id: item.id,
    username: item.username,
    perfil: item.perfil,
    operativo: item.operativo,
  };
  try {
    const response: any = await sendPut(newObj, 'usuario/edit', true, jwt);
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
    const response: any = await sendDelete(id, 'usuario', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit };
