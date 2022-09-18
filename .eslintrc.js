// @ts-check

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		"eslint:recommended",
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"plugin:playwright/playwright-test",
		"plugin:prettier/recommended",
	],
};
