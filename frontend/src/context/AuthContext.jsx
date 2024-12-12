import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("blogs-token"));

  const login = (newToken) => {
    localStorage.setItem("blogs-token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("blogs-token");
    setToken(null);
    
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export  const useAuth = () => useContext(AuthContext);
