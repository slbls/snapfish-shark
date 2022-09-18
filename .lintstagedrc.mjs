// @ts-check
import path from "path";

const getEslintCommand = (filenames) =>
	`next lint --fix --file ${filenames
		.map((filename) => path.relative(process.cwd(), filename))
		.join(" --file ")}`;

export default {
	"*": "prettier --ignore-unknown --write",
	"*.{js,jsx,ts,tsx}": [getEslintCommand],
};
