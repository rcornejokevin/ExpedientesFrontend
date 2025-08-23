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
    return response;
  } catch (error) {
    console.error('Error in API request:', error);
    throw new Error('Failed to send request');
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
export { sendPost, sendGet };
