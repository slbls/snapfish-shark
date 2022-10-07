/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	test: {
		setupFiles: "vitest.setup.ts",
		exclude: [...configDefaults.exclude, "**/__utils__/**", "**/e2e/**"],
		environment: "jsdom",
	},
});
