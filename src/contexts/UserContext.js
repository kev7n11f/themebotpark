import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const data = await api.verifyToken(token);

      if (data.valid && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        setAuthError(null);
      } else {
        localStorage.removeItem('authToken');
        localStorage.setItem('hasSubscription', 'false');
        setAuthError('Authentication failed. Please log in again.');
      }
      setIsLoading(false);
    } catch (error) {
      // Only log actual errors, not network issues
      if (error.name !== 'TypeError' && !error.message.includes('fetch')) {
        console.error('Auth check error:', error);
      }
      localStorage.removeItem('authToken');
      localStorage.setItem('hasSubscription', 'false');
      setAuthError(null); // Don't show auth errors on initial load
      setIsLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await api.login(email, password);
      
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        return { success: true };
      } else {
        setAuthError(data.error || 'Login failed');
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || error.error || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (email, password, name) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      console.log('UserContext: Starting registration for:', email);
      const data = await api.register(email, password, name);
      console.log('UserContext: Registration response success:', data.success, 'error:', data.error);
      
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        console.log('UserContext: Registration successful');
        return { success: true };
      } else {
        const errorMsg = data.error || 'Registration failed';
        console.log('UserContext: Registration failed with error:', errorMsg);
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Registration error caught:', error);
      const errorMessage = error.message || error.error || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await api.call('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          action: 'forgot-password',
          email
        })
      });
      
      if (data.success) {
        return { success: true };
      } else {
        setAuthError(data.error || 'Password reset failed');
        return { success: false, error: data.error || 'Password reset failed' };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError('Password reset error.');
      return { success: false, error: 'Password reset error.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.setItem('hasSubscription', 'false');
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };


  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      authError,
      login,
      register,
      forgotPassword,
      logout
    }}>
      {authError && (
        <div style={{background:'#fee',color:'#c33',padding:'1rem',margin:'1rem',border:'1px solid #fcc',borderRadius:'4px'}}>
          <strong>Authentication Error:</strong> {authError}
          <br />
          <small>Check browser console for detailed debugging information.</small>
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};
