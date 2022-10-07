import { SNAPFISH_LOGIN_URL } from "@/config";
import { rest, RestHandler } from "msw";

export const handlers: readonly RestHandler[] = [
	rest.post(SNAPFISH_LOGIN_URL, (_request, response, context) => {
		const isAuthenticated =
			sessionStorage.getItem("is-authenticated") === "true";
		if (!isAuthenticated) {
			// Any status code other than 200 indicates an error wherein the user is
			// not authenticated.
			return response(context.status(200));
		}

		// A successful login is represented by a redirect, hence the 302 status
		// code.
		return response(context.status(302), context.cookie("oa2", "foo"));
	}),
];
