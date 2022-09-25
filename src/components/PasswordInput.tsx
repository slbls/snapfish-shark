import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { ChangeEventHandler, useState } from "react";

export const PASSWORD_INPUT_PLACEHOLDER = "Enter password...";
export const PASSWORD_INPUT_HIDDEN_BUTTON_TEXT = "Show";
export const PASSWORD_INPUT_SHOWING_BUTTON_TEXT = "Hide";

type PasswordInputProps = {
	readonly value: string;
	readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
	const [isShowing, setIsShowing] = useState(false);

	const handleClick = () => setIsShowing(!isShowing);

	return (
		<InputGroup>
			<Input
				paddingRight="4.5rem"
				required
				type={isShowing ? "text" : "password"}
				placeholder={PASSWORD_INPUT_PLACEHOLDER}
				value={value}
				onChange={onChange}
			/>
			<InputRightElement width="4.5rem">
				<Button height="1.75rem" size="sm" onClick={handleClick}>
					{isShowing
						? PASSWORD_INPUT_SHOWING_BUTTON_TEXT
						: PASSWORD_INPUT_HIDDEN_BUTTON_TEXT}
				</Button>
			</InputRightElement>
		</InputGroup>
	);
};
