module.exports = {
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            borderWidth: ['first']
        },
    },
    plugins: [require('daisyui')],
}