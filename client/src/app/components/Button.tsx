// components/Button.js
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }
  
  const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const baseStyles = 'px-4 py-2 rounded focus:outline-none transition duration-200';
    const variants = {
        primary: 'bg-[#063970] text-white hover:bg-[#C4C7C9] hover:text-[#063970] hover:border border-[#063970]',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        outline: 'border border-[#063970] text-[#063970] hover:bg-[#063970] hover:text-white',
    };



    return (
        <button
            onClick={onClick}
            className={`font-BricolageGrotesque text-sm ${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
