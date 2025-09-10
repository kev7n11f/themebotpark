import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const [success, setSuccess] = useState('');
  const { login, register, forgotPassword } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }
    }

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else if (mode === 'register') {
        console.log('AuthModal: Starting registration...');
        result = await register(formData.email, formData.password, formData.name);
        console.log('AuthModal: Registration result success:', result.success, 'error:', result.error);
      } else if (mode === 'forgot') {
        result = await forgotPassword(formData.email);
      }

      if (result.success) {
        if (mode === 'forgot') {
          setSuccess('Password reset link sent! Check your email.');
        } else {
          onClose();
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        }
      } else {
        console.log('AuthModal: Setting error message:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('AuthModal: Caught error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Forgot Password'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          {(mode === 'login' || mode === 'register') && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}
          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          {mode === 'forgot' && (
            <p>Enter your email to receive a password reset link.</p>
          )}
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Send Reset Link'}
          </button>
        </form>
        <div className="auth-switch">
          {mode !== 'login' && (
            <button onClick={() => setMode('login')}>Already have an account? Login</button>
          )}
          {mode !== 'register' && (
            <button onClick={() => setMode('register')}>Need an account? Register</button>
          )}
          {mode !== 'forgot' && (
            <button onClick={() => setMode('forgot')}>Forgot password?</button>
          )}
        </div>
      </div>
    </div>
  );
}

