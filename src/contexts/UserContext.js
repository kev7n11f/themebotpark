import React, { createContext, useContext, useEffect, useState } from 'react';

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
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.setItem('hasSubscription', 'false');
      setAuthError('Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
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

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email, password, name) => {
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

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('hasSubscription', data.user.subscription === 'premium' ? 'true' : 'false');
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? 'https://themebotpark.onrender.com' : '';
      await fetch(`${apiBase}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout'
        }),
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.setItem('hasSubscription', 'false');
      localStorage.setItem('messageCount', '0');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const upgradeSubscription = () => {
    // Update user subscription status
    if (user) {
      const updatedUser = { ...user, subscription: 'premium' };
      setUser(updatedUser);
      localStorage.setItem('hasSubscription', 'true');
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    upgradeSubscription,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {authError && (
        <div style={{background:'#fee',color:'#c33',padding:'1rem',margin:'1rem',border:'1px solid #fcc',borderRadius:'4px'}}>
          <strong>Authentication Error:</strong> {authError}
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};
