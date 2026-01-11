import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'

    const variantClasses = {
        primary: 'bg-accent-primary hover:bg-accent-secondary text-white',
        secondary: 'bg-bg-tertiary hover:bg-bg-secondary text-text-primary border border-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'bg-transparent hover:bg-bg-tertiary text-text-primary',
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    )
}
