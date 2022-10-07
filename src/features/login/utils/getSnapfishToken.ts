import {
	COOKIE_KEY_VALUE_SEPARATOR_CHARACTER,
	COOKIE_SEPARATOR_CHARACTER,
	SET_COOKIE_HEADER_NAME,
	SNAPFISH_HOME_URL,
	SNAPFISH_LOGIN_URL,
	SNAPFISH_OAUTH_COOKIE_NAME,
} from "@/config";

type GetSnapfishTokenParams = {
	readonly email: string;
	readonly password: string;
};

/**
 * Gets a Snapfish OAuth token from the Snapfish login endpoint.
 *
 * Ideally, there would be some sort of API documentation provided by Snapfish
 * to properly perform authentication and retrieve an OAuth token. However,
 * there isn't, so this function aims to emulate the behavior that occurs
 * when a user logs into Snapfish via a web browser.
 *
 * This is by all means a hack.
 */
export const getSnapfishToken = async ({
	email,
	password,
}: GetSnapfishTokenParams) => {
	const response = await fetch(
		// These two query parameters are required for the request to be successful.
		`${SNAPFISH_LOGIN_URL}?submit=true&componentID=1395868004571`,
		{
			method: "POST",
			body: new URLSearchParams({
				// In addition to `EmailAddress` and `Password`, `iwPreActions` and
				// `next` are required for the request to be successful.
				iwPreActions: "submit",
				next: SNAPFISH_HOME_URL,
				EmailAddress: email,
				Password: password,
			}),
		}
	);

	const [, rawToken] = Array.from(response.headers).find(
		([key, value]) =>
			key.toLowerCase() === SET_COOKIE_HEADER_NAME &&
			value.startsWith(SNAPFISH_OAUTH_COOKIE_NAME)
	);

	if (!rawToken) {
		throw Error(
			`Unable to get authentication token: no "${SET_COOKIE_HEADER_NAME}" header.`
		);
	}

	const firstCookie = rawToken.split(COOKIE_SEPARATOR_CHARACTER)[0];
	const token = firstCookie.replace(
		`${SNAPFISH_OAUTH_COOKIE_NAME}${COOKIE_KEY_VALUE_SEPARATOR_CHARACTER}`,
		"OAuth "
	);

	return token;
};
