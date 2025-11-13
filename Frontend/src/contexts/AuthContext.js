import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (token, userId, role) => {
    localStorage.setItem('token', token);
    setUser({ userId, role });
  };
  // const logout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   setUser(null);
  // };

   const logout = () => {
    localStorage.clear();  
    setUser(null);         
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
