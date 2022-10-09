import { ChangeEventHandler, useState } from "react";

type UseEmailReturn = {
	readonly email: string;
	readonly handleEmailChange: ChangeEventHandler<HTMLInputElement>;
};

export const useEmail = (): UseEmailReturn => {
	const [email, setEmail] = useState("");
	const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (event) =>
		setEmail(event.target.value);

	return { email, handleEmailChange };
};
