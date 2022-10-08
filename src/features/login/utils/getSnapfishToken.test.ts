import { mockSnapfishAuthentication } from "@/__utils__/snapfish-authentication";
import { expect, it } from "vitest";
import { getSnapfishToken } from "./getSnapfishToken";

const email = "foo@example.com";
const password = "FooBarBaz!";

it("returns Snapfish OAuth token when given proper credentials", async () => {
	const unmockSnapfishAuthenticated = mockSnapfishAuthentication();

	const token = await getSnapfishToken({ email, password });
	expect(token).toBeDefined();

	unmockSnapfishAuthenticated();
});

it("throws error when given improper credentials and no token exists in the response", async () => {
	await expect(getSnapfishToken({ email, password })).rejects.toThrow();
});
