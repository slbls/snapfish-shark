import { server } from "@/__mocks__/server";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => {
	cleanup();
});

afterAll(() => server.close());
