'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserRole = 'admin' | 'staff' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isPremium: boolean;
  isVIP: boolean;
}

// Context interface
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Ändra mockUsers för att bara ha ett admin-konto
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    isPremium: true,
    isVIP: true
  }
];

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      
      // Check local storage for auth
      const storedUser = localStorage.getItem('sugarbabes_user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem('sugarbabes_user');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function med uppdaterad lösenordskontroll
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Hitta användare på användarnamn istället för email
    const foundUser = mockUsers.find(u => u.email === email);
    
    // Kolla om användaren finns och lösenordet är "1422"
    if (foundUser && password === '1422') {
      // Set user in state and local storage
      setUser(foundUser);
      localStorage.setItem('sugarbabes_user', JSON.stringify(foundUser));
      
      // Set cookie for middleware auth (would be done server-side in a real app)
      document.cookie = `session-token=${foundUser.role}-session-id; path=/; max-age=86400`;
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sugarbabes_user');
    document.cookie = 'session-token=; path=/; max-age=0';
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user with email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      role: 'user',
      isPremium: false,
      isVIP: false
    };
    
    // Add user to mock DB (in a real app, this would be an API call)
    mockUsers.push(newUser);
    
    // Login the new user
    setUser(newUser);
    localStorage.setItem('sugarbabes_user', JSON.stringify(newUser));
    document.cookie = `session-token=user-session-id; path=/; max-age=86400`;
    
    setIsLoading(false);
    return true;
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user) {
      // Update user in state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update in local storage
      localStorage.setItem('sugarbabes_user', JSON.stringify(updatedUser));
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}; 