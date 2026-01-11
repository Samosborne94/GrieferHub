import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        const inputClasses = `
      w-full px-4 py-2 rounded-lg 
      bg-bg-tertiary border 
      ${error ? 'border-red-500' : 'border-gray-700'} 
      text-text-primary placeholder-text-tertiary
      focus:outline-none focus:ring-2 
      ${error ? 'focus:ring-red-500' : 'focus:ring-accent-primary'}
      transition-all duration-200
      ${className}
    `

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-text-tertiary">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
