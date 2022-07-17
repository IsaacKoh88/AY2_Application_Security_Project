module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'theme-blue-black': '#0A0029',
                'theme-blue-dark': '#0C0032',
            }
        },
        container: {
            center: true,
            padding: '16px',
        },
    },
    plugins: [],
}