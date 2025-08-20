const sendPost = (body: any, method: string, useJwt: boolean, jwt?: string) => {
  const apiUrl = import.meta.env.VITE_URL;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (useJwt) {
    headers.Authorization = `Bearer ${jwt ?? ''}`;
  }
  try {
    const response = fetch(`${apiUrl}${method}`, {
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

export { sendPost };
