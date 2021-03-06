module.exports = {
	purge: ["./renderer/pages/**/*.{js,ts,jsx,tsx}", "./renderer/components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false,
	theme: {
		fontFamily: {
			sans: ["Inter", "sans-serif"]
		},
		extend: {
			zIndex: {
				"100": "100",
				"110": "110"
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};