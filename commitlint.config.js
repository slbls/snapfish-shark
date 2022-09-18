// @ts-check

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
	extends: ["@commitlint/config-conventional"],

	// At the time of writing, Dependabot has body lines exceeding the allowed
	// limit of 100 characters. commitlint thus has to be configured to ignore
	// these specific commit messages.
	// https://github.com/dependabot/dependabot-core/issues/2445
	ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
};
