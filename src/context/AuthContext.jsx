import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Sistem Dummy: Pura-puranya belum ada user yang login
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

