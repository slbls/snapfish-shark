import { SNAPFISH_LOGIN_URL } from "@/config";
import { rest, RestHandler } from "msw";

// At the time of writing, these are the headers required for the login API
// request to be successful. This should match up with the headers found in
// `getSnapfishToken.ts`.
const REQUIRED_LOGIN_HEADERS = [
	"iwPreActions",
	"next",
	"EmailAddress",
	"Password",
];

export const handlers: readonly RestHandler[] = [
	rest.post(SNAPFISH_LOGIN_URL, (request, response, context) => {
		const hasRequiredHeaders = Array.from(request.headers).filter(([key]) =>
			REQUIRED_LOGIN_HEADERS.includes(key)
		);
		if (!hasRequiredHeaders) {
			// 403 may not always be the status code that the Snapfish API returns on
			// error, but the request-sender will only be looking for a non-302 status
			// code to indicate an error. THus, it doesn't really matter what mocked
			// status code is provided her, as long as it gets properly handled in the
			// calling code.
			return response(context.status(403));
		}

		// A successful login is represented by a redirect, hence the 302 status
		// code.
		return response(context.status(302));
	}),
];
