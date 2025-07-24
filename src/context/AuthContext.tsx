/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: any | null;
  loginContext: (userData: User) => void;
  logout: () => void;
  verification: any | null;
  setVerification: (code: any | null) => void;
  setTwoFA: (abc: any | null) => void;
  twoFA: any | null;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loginContext: () => {},
  logout: () => {},
  verification: null,
  setVerification: () => {},
  setTwoFA: () => {},
  twoFA: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [verification, setVerification] = useState<string | null>(null);
  const [twoFA, setTwoFA] = useState<string | null>(null);
  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  const loginContext = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user data from localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        verification,
        setVerification,
        loginContext,
        logout,
        setTwoFA,
        twoFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
