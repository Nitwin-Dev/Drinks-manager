import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setUser({ email: 'atendente@teste.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciais de teste
      if (email === 'atendente@teste.com' && password === '123456') {
        const mockToken = 'mock-jwt-token';
        const userData = { email };
        
        setToken(mockToken);
        setUser(userData);
        localStorage.setItem('token', mockToken);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Credenciais inválidas' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro ao fazer login' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

