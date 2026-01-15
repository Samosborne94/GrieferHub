/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Background colors - Layered depth system with subtle variations
                'bg-primary': '#0a0a0a',
                'bg-secondary': '#141414',
                'bg-tertiary': '#1e1e1e',
                'bg-elevated': '#252525',
                'bg-hover': '#2a2a2a',
                'bg-card': '#1a1a1a',
                'bg-overlay': 'rgba(10, 10, 10, 0.95)',

                // Text colors - Enhanced semantic hierarchy
                'text-primary': '#ffffff',
                'text-secondary': '#a0a0a0',
                'text-tertiary': '#666666',
                'text-muted': '#4a4a4a',
                'text-placeholder': '#3a3a3a',

                // Accent colors - Enhanced brand palette with state variations
                'accent-primary': '#ff4444',
                'accent-primary-hover': '#ff5555',
                'accent-primary-active': '#ff3333',
                'accent-secondary': '#ff6b6b',
                'accent-tertiary': '#ff8888',
                'accent-muted': 'rgba(255, 68, 68, 0.1)',
                'accent-muted-hover': 'rgba(255, 68, 68, 0.2)',

                // Status colors - Complete semantic states with backgrounds
                'status-verified': '#10b981',
                'status-verified-bg': 'rgba(16, 185, 129, 0.1)',
                'status-verified-border': 'rgba(16, 185, 129, 0.3)',
                'status-review': '#f59e0b',
                'status-review-bg': 'rgba(245, 158, 11, 0.1)',
                'status-review-border': 'rgba(245, 158, 11, 0.3)',
                'status-resolved': '#3b82f6',
                'status-resolved-bg': 'rgba(59, 130, 246, 0.1)',
                'status-resolved-border': 'rgba(59, 130, 246, 0.3)',
                'status-rejected': '#ef4444',
                'status-rejected-bg': 'rgba(239, 68, 68, 0.1)',
                'status-rejected-border': 'rgba(239, 68, 68, 0.3)',
                'status-pending': '#8b5cf6',
                'status-pending-bg': 'rgba(139, 92, 246, 0.1)',
                'status-pending-border': 'rgba(139, 92, 246, 0.3)',

                // Severity colors - Enhanced threat levels with states
                'severity-low': '#6b7280',
                'severity-low-bg': 'rgba(107, 114, 128, 0.1)',
                'severity-low-border': 'rgba(107, 114, 128, 0.3)',
                'severity-medium': '#f59e0b',
                'severity-medium-bg': 'rgba(245, 158, 11, 0.1)',
                'severity-medium-border': 'rgba(245, 158, 11, 0.3)',
                'severity-high': '#f97316',
                'severity-high-bg': 'rgba(249, 115, 22, 0.1)',
                'severity-high-border': 'rgba(249, 115, 22, 0.3)',
                'severity-critical': '#dc2626',
                'severity-critical-bg': 'rgba(220, 38, 38, 0.1)',
                'severity-critical-border': 'rgba(220, 38, 38, 0.3)',

                // Border colors - Subtle separation system
                'border-primary': 'rgba(255, 255, 255, 0.1)',
                'border-secondary': 'rgba(255, 255, 255, 0.05)',
                'border-tertiary': 'rgba(255, 255, 255, 0.02)',
                'border-accent': 'rgba(255, 68, 68, 0.3)',
                'border-accent-hover': 'rgba(255, 68, 68, 0.5)',

                // Success, warning, error, info states
                'success': '#10b981',
                'success-bg': 'rgba(16, 185, 129, 0.1)',
                'success-border': 'rgba(16, 185, 129, 0.3)',
                'warning': '#f59e0b',
                'warning-bg': 'rgba(245, 158, 11, 0.1)',
                'warning-border': 'rgba(245, 158, 11, 0.3)',
                'error': '#ef4444',
                'error-bg': 'rgba(239, 68, 68, 0.1)',
                'error-border': 'rgba(239, 68, 68, 0.3)',
                'info': '#3b82f6',
                'info-bg': 'rgba(59, 130, 246, 0.1)',
                'info-border': 'rgba(59, 130, 246, 0.3)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
                '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }],
                '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                // Elevation shadows - Depth system
                'elevation-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
                'elevation-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                'elevation-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
                'elevation-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                'elevation-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',

                // Glow effects - Accent highlights
                'glow': '0 0 20px rgba(255, 68, 68, 0.3)',
                'glow-md': '0 0 30px rgba(255, 68, 68, 0.35)',
                'glow-lg': '0 0 40px rgba(255, 68, 68, 0.4)',
                'glow-xl': '0 0 60px rgba(255, 68, 68, 0.5)',
                'inner-glow': 'inset 0 0 20px rgba(255, 68, 68, 0.1)',
                'inner-glow-lg': 'inset 0 0 30px rgba(255, 68, 68, 0.15)',

                // Colored glows for status states
                'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
                'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
                'glow-info': '0 0 20px rgba(59, 130, 246, 0.3)',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'DEFAULT': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
                '2xl': '40px',
                '3xl': '64px',
            },
            animation: {
                // Fade animations
                'fade-in': 'fadeIn 0.4s ease-out',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'fade-in-down': 'fadeInDown 0.5s ease-out',
                'fade-out': 'fadeOut 0.3s ease-out',

                // Slide animations
                'slide-in-left': 'slideInLeft 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.5s ease-out',
                'slide-in-up': 'slideInUp 0.5s ease-out',
                'slide-out-right': 'slideOutRight 0.3s ease-in',

                // Scale animations
                'scale-in': 'scaleIn 0.3s ease-out',
                'scale-out': 'scaleOut 0.2s ease-in',
                'scale-bounce': 'scaleBounce 0.5s ease-out',

                // Rotate animations
                'spin': 'spin 1s linear infinite',
                'spin-slow': 'spin 3s linear infinite',
                'spin-fast': 'spin 0.5s linear infinite',

                // Pulse animations
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',

                // Special effects
                'shimmer': 'shimmer 2s linear infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',

                // Entrance animations
                'enter': 'enter 0.3s ease-out',
                'exit': 'exit 0.2s ease-in',
            },
            keyframes: {
                // Fade keyframes
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },

                // Slide keyframes
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideOutRight: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(30px)' },
                },

                // Scale keyframes
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                scaleOut: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.95)' },
                },
                scaleBounce: {
                    '0%': { transform: 'scale(0.9)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },

                // Special effect keyframes
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 68, 68, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 68, 68, 0.6)' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                enter: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                exit: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.95)' },
                },
            },
            transitionDuration: {
                '50': '50ms',
                '100': '100ms',
                '150': '150ms',
                '200': '200ms',
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '500': '500ms',
                '600': '600ms',
                '700': '700ms',
                '1000': '1000ms',
            },
            transitionTimingFunction: {
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'snappy': 'cubic-bezier(0.4, 0, 0.6, 1)',
                'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-radial-at-t': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
                'gradient-radial-at-b': 'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
                'gradient-radial-at-l': 'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
                'gradient-radial-at-r': 'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
                'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                'accent-gradient': 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
                'accent-gradient-intense': 'linear-gradient(135deg, #ff3333 0%, #ff8888 100%)',
            },
            blur: {
                'xs': '2px',
                'sm': '4px',
                'DEFAULT': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
                '2xl': '40px',
                '3xl': '64px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
