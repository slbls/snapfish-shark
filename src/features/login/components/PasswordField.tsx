import { PasswordInput } from "@/components/PasswordInput";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

type PasswordFieldProps = {
	readonly value: string;
	readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export const PasswordField = ({ value, onChange }: PasswordFieldProps) => (
	<FormControl isRequired>
		<FormLabel>Password</FormLabel>
		<PasswordInput value={value} onChange={onChange} />
	</FormControl>
);
