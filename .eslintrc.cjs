/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	parser: "@babel/eslint-parser",
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		requireConfigFile: false
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
};
