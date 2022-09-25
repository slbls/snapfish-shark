import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import {
	PasswordInput,
	PASSWORD_INPUT_HIDDEN_BUTTON_TEXT,
	PASSWORD_INPUT_PLACEHOLDER,
	PASSWORD_INPUT_SHOWING_BUTTON_TEXT,
} from "./PasswordInput";

const MockPasswordInput = <PasswordInput value="" onChange={() => void 0} />;

type ExpectHiddenPasswordParams = {
	readonly input: HTMLElement;
	readonly button: HTMLElement;
};

const expectHiddenPassword = async ({
	input,
	button,
}: ExpectHiddenPasswordParams) => {
	await expect(input).toBeInTheDocument();
	await expect(input).toHaveAttribute("type", "password");

	await expect(button).toBeInTheDocument();
	await expect(button).toHaveTextContent(PASSWORD_INPUT_HIDDEN_BUTTON_TEXT);
};

type RenderMockPasswordInputReturn = [input: HTMLElement, button: HTMLElement];

const renderMockPasswordInput = (): RenderMockPasswordInputReturn => {
	const { getByPlaceholderText, getByText } = render(MockPasswordInput);

	const input = getByPlaceholderText(PASSWORD_INPUT_PLACEHOLDER);
	const button = getByText(PASSWORD_INPUT_HIDDEN_BUTTON_TEXT);

	return [input, button];
};

it("defaults to hidden password", async () => {
	const [input, button] = renderMockPasswordInput();

	await expectHiddenPassword({ input, button });
});

it("shows password when password is currently hidden and button is pressed", async () => {
	const [input, button] = renderMockPasswordInput();

	await expectHiddenPassword({ input, button });

	await button.click();
	await expect(button).toHaveTextContent(PASSWORD_INPUT_SHOWING_BUTTON_TEXT);

	await expect(input).toBeInTheDocument();
	await expect(input).toHaveAttribute("type", "text");
});
