import { expect, it } from "vitest";
import { getSnapfishToken } from "./getSnapfishToken";

const email = "foo@example.com";
const password = "FooBarBaz!";

it("returns Snapfish OAuth token", async () => {
	sessionStorage.setItem("is-authenticated", "true");
	const token = await getSnapfishToken({ email, password });
	expect(token).toBeDefined();
	sessionStorage.removeItem("is-authenticated");
});

it("throws error when no token exists in the response", async () => {
	await expect(getSnapfishToken({ email, password })).rejects.toThrow();
});
