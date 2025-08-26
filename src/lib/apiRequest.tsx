const sendPost = async (
  body: any,
  method: string,
  useJwt: boolean,
  jwt?: string,
) => {
  const apiUrl = import.meta.env.VITE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (useJwt) {
    headers.Authorization = `Bearer ${jwt ?? ''}`;
  }
  try {
    const response = await fetch(`${apiUrl}${method}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
      let errorBody: any = null;
      try {
        errorBody = await response.clone().json();
      } catch {
        try {
          const text = await response.clone().text();
          errorBody = { message: text };
        } catch {
          errorBody = { message: 'No response body' };
        }
      }
      if (errorBody?.message && errorBody?.data) {
        return {
          code: errorBody.code,
          message: errorBody.message,
          data: errorBody.data,
        };
      }
      if (errorBody?.message) {
        errorMessage += `: ${errorBody.message}`;
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
const sendPut = async (
  body: any,
  method: string,
  useJwt: boolean,
  jwt?: string,
) => {
  const apiUrl = import.meta.env.VITE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (useJwt) {
    headers.Authorization = `Bearer ${jwt ?? ''}`;
  }
  try {
    const response = await fetch(`${apiUrl}${method}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
      let errorBody: any = null;
      try {
        errorBody = await response.clone().json();
      } catch {
        try {
          const text = await response.clone().text();
          errorBody = { message: text };
        } catch {
          errorBody = { message: 'No response body' };
        }
      }
      if (errorBody?.message && errorBody?.data) {
        return {
          code: errorBody.code,
          message: errorBody.message,
          data: errorBody.data,
        };
      }
      if (errorBody?.message) {
        errorMessage += `: ${errorBody.message}`;
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
const sendGet = async (params: any, method: string, jwt: string) => {
  const apiUrl = import.meta.env.VITE_URL;
  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${jwt ?? ''}`,
  };
  try {
    const response = await fetch(`${apiUrl}${method}${queryString}`, {
      method: 'GET',
      headers,
    });
    return response;
  } catch (error) {
    console.error('Error in API request:', error);
    throw new Error('Failed to send request');
  }
};
const sendDelete = async (id: number, method: string, jwt: string) => {
  const apiUrl = import.meta.env.VITE_URL;
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${jwt ?? ''}`);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${jwt ?? ''}`,
  };

  try {
    const response = await fetch(`${apiUrl}${method}/${id}`, {
      method: 'DELETE',
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error('Error in API request:', error);
    throw new Error('Failed to send request');
  }
};
export { sendPost, sendGet, sendDelete, sendPut };
