import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type AuthContentValue = {
  isAuthenticated: boolean;
  signOut: () => void;
  signIn: () => void;
};

const AuthContext = createContext<AuthContentValue | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = () => {
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
