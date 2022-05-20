const colors = require('tailwindcss/colors')

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: '#000000',
			blue: {
				300: '#2274a5'
			},
			white: {
				text: '#e9eae9'
			},
			gray: {
				25: '#707070',
				50: '#686868',
				100: '#575757',
				150: '#4a4a4a',
				200: '#383838',
				250: '#333333',
				275: '#191919',
				300: '#161616',
				400: '#111517',
				500: '#101010'
			},
			red: {
				warning: '#a52222'
			},
			orange: {
				short: '#d74e09'
			},
			yellow: {
				400: '#fec004'
			}
		},
		extend: {}
	},
	plugins: []
}
