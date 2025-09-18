import { sendDelete, sendGet, sendPost, sendPut } from '@/lib/apiRequest';

export interface ItemSubEtapa {
  id?: string;
  nombre: string;
  ayuda?: string;
  etapa?: string;
  orden?: number;
}
export interface ListaOrden {
  id?: string;
  orden?: number;
}
const GetList = async (jwt: string) => {
  const response = await sendGet('', 'etapa_detalle/list', jwt);
  return await response;
};
const New = async (jwt: string, obj: ItemSubEtapa) => {
  const newObj = {
    nombre: obj.nombre,
    orden: obj.orden,
    detalle: obj.ayuda,
    etapaId: obj.etapa,
  };
  try {
    const response: any = await sendPost(
      newObj,
      'etapa_detalle/add',
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
const Edit = async (jwt: string, item: ItemSubEtapa) => {
  const newObj = {
    id: item.id,
    nombre: item.nombre,
    detalle: item.ayuda,
    etapaId: item.etapa,
    orden: item.orden,
  };
  try {
    const response: any = await sendPut(
      newObj,
      'etapa_detalle/edit',
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
const Orden = async (jwt: string, orden: any) => {
  try {
    const response: any = await sendPut(
      orden,
      'etapa_detalle/orden',
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
const Delete = async (jwt: string, id: number) => {
  try {
    const response: any = await sendDelete(id, 'etapa_detalle', jwt);
    return response;
  } catch (error) {
    throw error;
  }
};
export { GetList, New, Delete, Edit, Orden };
