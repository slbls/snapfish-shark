import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

type EmailFieldProps = {
	readonly value: string;
	readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export const EmailField = ({ value, onChange }: EmailFieldProps) => (
	<FormControl isRequired>
		<FormLabel>Email</FormLabel>
		<Input type="email" value={value} onChange={onChange} />
	</FormControl>
);
