import { ChangeEventHandler, useState } from "react";

type UsePasswordReturn = {
	readonly password: string;
	readonly handlePasswordChange: ChangeEventHandler<HTMLInputElement>;
};

export const usePassword = (): UsePasswordReturn => {
	const [password, setPassword] = useState("");
	const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) =>
		setPassword(event.target.value);

	return { password, handlePasswordChange };
};
