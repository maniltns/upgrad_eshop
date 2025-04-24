export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setIsAdmin = (isAdmin) => {
  localStorage.setItem('isAdmin', isAdmin);
};

export const getIsAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const removeIsAdmin = () => {
  localStorage.removeItem('isAdmin');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  removeAuthToken();
  removeIsAdmin();
};

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 