import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'tactical' | 'glass' | 'outline' | 'custom'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    isLoading?: boolean
    glow?: boolean
    fullWidth?: boolean
    uppercase?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    glow = false,
    fullWidth = false,
    uppercase = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-xl overflow-hidden active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

    const variantClasses = {
        primary: 'bg-accent-primary hover:bg-accent-primary-hover text-white shadow-lg shadow-accent-primary/20',
        secondary: 'bg-bg-elevated hover:bg-bg-hover text-text-primary border border-border-primary hover:border-border-accent',
        danger: 'bg-status-rejected hover:bg-accent-primary text-white shadow-lg shadow-status-rejected/20',
        ghost: 'bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary',
        tactical: 'bg-accent-primary hover:bg-accent-primary-hover text-white tracking-widest uppercase shadow-glow hover:shadow-glow-lg',
        glass: 'glass-card hover:bg-bg-elevated text-text-primary border border-white/10 hover:border-accent-primary/50 uppercase tracking-widest',
        outline: 'bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white',
        custom: '',
    }

    const sizeClasses = {
        xs: 'px-3 py-1 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl font-black',
    }

    const glowClasses = glow ? 'shadow-glow hover:shadow-glow-lg' : ''
    const widthClasses = fullWidth ? 'w-full' : ''
    const textClasses = uppercase ? 'uppercase tracking-widest' : ''

    return (
        <button
            className={`
                ${baseClasses} 
                ${variantClasses[variant]} 
                ${sizeClasses[size]} 
                ${glowClasses} 
                ${widthClasses} 
                ${textClasses} 
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Loading Spinner Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
            
            {/* Ripple/Glow effect overlay for certain variants */}
            {(variant === 'tactical' || (variant === 'primary' && glow)) && (
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}

            <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </span>
        </button>
    )
}
