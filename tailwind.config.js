qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Background colors
                'bg-primary': '#0a0a0a',
                'bg-secondary': '#141414',
                'bg-tertiary': '#1e1e1e',

                // Text colors
                'text-primary': '#ffffff',
                'text-secondary': '#a0a0a0',
                'text-tertiary': '#666666',

                // Accent colors
                'accent-primary': '#ff4444',
                'accent-secondary': '#ff6b6b',

                // Status colors
                'status-verified': '#10b981',
                'status-review': '#f59e0b',
                'status-resolved': '#3b82f6',
                'status-rejected': '#ef4444',

                // Severity colors
                'severity-low': '#6b7280',
                'severity-medium': '#f59e0b',
                'severity-high': '#f97316',
                'severity-critical': '#dc2626',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
