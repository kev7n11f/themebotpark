import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {

  return context;


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

      const apiBase = process.env.NODE_ENV === 'production' ? 'https://themebotpark.onrender.com' : '';
      const response = await fetch(`${apiBase}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify-token',
          token
        }),
      });

      if (!response.ok) {
        setAuthError('Authentication server error. Please try again later.');
        setIsLoading(false);
        return;
      }

      const data = await response.json();

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
      setAuthError('Authentication error.');
      setIsLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? 'https://themebotpark.onrender.com' : '';
      const response = await fetch(`${apiBase}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        }),
      });
      const data = await response.json();
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
      setAuthError('Login error.');
      return { success: false, error: 'Login error.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (email, password, name) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? 'https://themebotpark.onrender.com' : '';
      const response = await fetch(`${apiBase}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          name
        }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        return { success: true };
      } else {
        setAuthError(data.error || 'Registration failed');
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      setAuthError('Registration error.');
      return { success: false, error: 'Registration error.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? 'https://themebotpark.onrender.com' : '';
      const response = await fetch(`${apiBase}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'forgot-password',
          email
        }),
      });
      const data = await response.json();
      if (data.success) {
        return { success: true };
      } else {
        setAuthError(data.error || 'Password reset failed');
        return { success: false, error: data.error || 'Password reset failed' };
      }
    } catch (error) {
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
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};
