import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemFlujo {
  id?: string;
  correlativo: string;
  nombre: string;
  ayuda?: string;
  CierreArchivado?: boolean;
  CierreDevolucionAlRemitente?: boolean;
  CierreEnviadoAJudicial?: boolean;
  flujoAsociado?: boolean;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'flujo/list', jwt);
  return await response;
};
const GetItemFlujoList = async (jwt: string): Promise<ItemFlujo[]> => {
  const response = await GetList(jwt);
  if (response.code === '000') {
    const data = response.data;
    const mapped: ItemFlujo[] = data.map((f: any) => ({
      id: String(f.id),
      nombre: f.nombre,
      ayuda: f.detalle ?? '',
    }));
    return mapped;
  } else {
    throw new Error(response.message);
  }
};
const New = async (jwt: string, newObj: any) => {
  try {
    const response: any = await sendPost(newObj, 'flujo/add', true, jwt);
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
const Edit = async (jwt: string, item: ItemFlujo) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    detalle: item.ayuda,
    correlativo: item.correlativo,
    cierreArchivado: item.CierreArchivado,
    cierreDevolucionAlRemitente: item.CierreDevolucionAlRemitente,
    cierreEnviadoAJudicial: item.CierreEnviadoAJudicial,
    flujoAsociado: item.flujoAsociado,
  };
  try {
    const response: any = await sendPut(newObj, 'flujo/edit', true, jwt);
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
    const response: any = await sendDelete(id, 'flujo', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit, GetItemFlujoList };
