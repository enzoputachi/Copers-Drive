
import adminApiService from '@/services/adminApi';
import { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Mock admin credentials - in a real app, this would be handled by your backend
const ADMIN_CREDENTIALS = {
  email: 'you@gmail.com',
  password: 'you'
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // setIsAuthenticated(true);
    // Check if user is already logged in (from localStorage)
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    console.log('login called with:', email, password)
    setLoading(true);
    
    try {      
      const response = await adminApiService.login({ email, password });

      const token = response.data.data.token;
      console.log("Token:", response)

      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message)
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};