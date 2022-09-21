import { expect } from "@playwright/test";
import { it } from "vitest";
import { getMissingProviderError } from "./getMissingProviderErrorMessage";

it('returns missing provider error message with the article "an" when `providerName` starts with a vowel', () => {
	const hookName = "useOof";
	const providerName = "OofProvider";

	const message = getMissingProviderError({
		hookName,
		providerName,
	});

	expect(message).toBe(`${hookName} must be used within an ${providerName}.`);
});

it('returns missing provider error message with the article "a" when `providerName` starts with a consonant', () => {
	const hookName = "useFoo";
	const providerName = "FooProvider";

	const message = getMissingProviderError({
		hookName,
		providerName,
	});

	expect(message).toBe(`${hookName} must be used within a ${providerName}.`);
});
