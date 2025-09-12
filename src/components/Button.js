import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  loading = false,
  disabled = false,
  icon,
  ...props 
}) => {
  const baseClasses = 'btn focus-ring';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    ghost: 'btn-ghost',
    premium: 'btn-premium'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md', 
    lg: 'btn-lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;