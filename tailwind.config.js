/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#F4E7B6',
                    DEFAULT: '#D4AF37', // Gold
                    dark: '#B8860B',
                },
                dark: {
                    light: '#333333',
                    DEFAULT: '#000000',
                    dark: '#000000',
                },
                luxury: {
                    gray: '#F5F5F3',
                    silver: '#C0C0C0',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'slow-zoom': 'slowZoom 20s infinite alternate linear',
                'progress': 'progress 3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slowZoom: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                },
                progress: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                }
            }
        },
    },
    plugins: [],
}
