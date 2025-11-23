import React from 'react';

const Button = ({ label, onClick, variant = 'primary', disabled = false }) => {
  const baseStyles = 'font-semibold py-2 px-4 rounded transition duration-200';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;