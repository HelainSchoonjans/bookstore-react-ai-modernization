import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const success = authService.signIn(username, password);
    if (success) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.signOut();
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  const isUserInRole = (role) => {
    return authService.isUserInRole(role);
  };

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    isUserInRole,
    getPrincipalName: authService.getPrincipalName.bind(authService)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
