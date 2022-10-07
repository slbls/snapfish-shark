import { server } from "@/__mocks__/server";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { fetch } from "cross-fetch";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

expect.extend(matchers);

// Fetch is not available in the LTS version of Node, so this polyfills it,
// allowing for requests to be intercepted and mocked by MSW.
globalThis.fetch = fetch;

beforeAll(() => server.listen());

afterEach(() => {
	server.resetHandlers();
	cleanup();
});

afterAll(() => server.close());
