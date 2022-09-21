import { startsWithVowel } from "./startsWithVowel";

type GetMissingProviderErrorParams = {
	readonly hookName: string;
	readonly providerName: string;
};

export const getMissingProviderError = ({
	hookName,
	providerName,
}: GetMissingProviderErrorParams) => {
	const article = startsWithVowel(providerName) ? "an" : "a";
	return `${hookName} must be used within ${article} ${providerName}.`;
};
