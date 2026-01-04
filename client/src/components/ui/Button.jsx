import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <span className="spinner"></span>}
            {children}
        </button>
    );
};

export default Button;
