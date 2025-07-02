import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('eventhub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'organizer@eventhub.com' && password === 'org123') {
      const organizerUser: User = {
        id: '2',
        name: 'Event Organizer',
        email: 'organizer@eventhub.com',
        role: 'organizer',
        createdAt: new Date()
      };
      setUser(organizerUser);
      localStorage.setItem('eventhub_user', JSON.stringify(organizerUser));
      setLoading(false);
      return true;
    } else if (email === 'user@eventhub.com' && password === 'user123') {
      const regularUser: User = {
        id: '3',
        name: 'John Doe',
        email: 'user@eventhub.com',
        role: 'user',
        createdAt: new Date()
      };
      setUser(regularUser);
      localStorage.setItem('eventhub_user', JSON.stringify(regularUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string, role: string = 'user'): Promise<boolean> => {
    setLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'user' | 'organizer',
      createdAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('eventhub_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventhub_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};