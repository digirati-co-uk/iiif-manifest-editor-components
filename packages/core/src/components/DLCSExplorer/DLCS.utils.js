export const getAuthHeader = session => {
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + session.auth);
  return headers;
};
