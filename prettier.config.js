/** @type {import("prettier").Config} */
const config = {
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: true,
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: true,
	singleAttributePerLine: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: ['**/*.json'],
			options: {
				useTabs: false,
			},
		},
		{
			files: ['**/*.mdx'],
			options: {
				proseWrap: 'preserve',
				htmlWhitespaceSensitivity: 'ignore',
			},
		},
	],
	plugins: ['prettier-plugin-tailwindcss'],
};

module.exports = config;
