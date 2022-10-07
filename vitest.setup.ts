import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

expect.extend(matchers);

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => {
	cleanup();
});

afterAll(() => server.close());
