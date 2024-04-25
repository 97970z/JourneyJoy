module.exports = {
	root: true,
	env: { browser: true, es2021: true },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
	],

	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	settings: { react: { version: "18.2" } },
	plugins: ["react", "react-hooks", "react-refresh"],
	rules: {
		"react/prop-types": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-uses-react": "off",
		"react/jsx-uses-vars": "off",
		"react-hooks/exhaustive-deps": "off",
		"eslint-disable-next-line": "off",
		"no-undef": "off",
		"no-unused-vars": "off",
	},
};
