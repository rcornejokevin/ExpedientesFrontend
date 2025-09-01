// Global unauthorized handler that can be wired from a React context (e.g., useAuth)
let onUnauthorized: (() => void) | null = null;
const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

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
    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Unauthorized');
    }
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
      if (response.status === 401) {
        onUnauthorized?.();
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
    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Unauthorized');
    }
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
      if (response.status === 401) {
        onUnauthorized?.();
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
    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Unauthorized');
    }
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
      if (response.status === 401) {
        onUnauthorized?.();
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
    // success
    try {
      return await response.json();
    } catch {
      return null; // GET sin body
    }
  } catch (error) {
    throw error;
  }
};
const sendDelete = async (id: number, method: string, jwt: string) => {
  const apiUrl = import.meta.env.VITE_URL;
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
    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Unauthorized');
    }
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
      if (response.status === 401) {
        onUnauthorized?.();
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
    try {
      return await response.json();
    } catch {
      return null; // DELETE sin body
    }
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
};
export { sendPost, sendGet, sendDelete, sendPut, setUnauthorizedHandler };
