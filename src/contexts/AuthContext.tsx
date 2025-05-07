
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "evaluator" | "assistant" | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock user data - this would normally come from a database
const MOCK_USERS = [
  {
    id: "1",
    email: "Admin@cecar.edu.co",
    password: "Admin20202025",
    name: "Administrador",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "Evaluador@cecar.edu.co",
    password: "Evaluador2025",
    name: "Evaluador",
    role: "evaluator" as UserRole,
  },
  {
    id: "3",
    email: "Asistente@cecar.edu.co",
    password: "Asistente2025",
    name: "Asistente",
    role: "assistant" as UserRole,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Find user with matching credentials
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      // Create a sanitized user object (without password)
      const { password: _, ...safeUserData } = user;
      setCurrentUser(safeUserData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem("currentUser", JSON.stringify(safeUserData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
