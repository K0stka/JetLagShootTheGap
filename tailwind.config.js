module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,html}", "./src/index.html"],
	theme: {
		extend: {
			colors: {
				background: "#f8fafc",
				foreground: "#18181b",
				accent: "#ef4444",
				card: "#fff",
				border: "#e5e7eb",
			},
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui"],
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
