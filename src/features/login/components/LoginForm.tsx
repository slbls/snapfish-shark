import { useSnapfishContext } from "@/providers/snapfish";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	Code,
	Container,
	Stack,
} from "@chakra-ui/react";
import { EmailField } from "./EmailField";
import { LoginButton } from "./LoginButton";
import { PasswordField } from "./PasswordField";

export const LoginForm = () => {
	const {
		email,
		handleEmailChange,
		password,
		handlePasswordChange,
		handleSubmit,
		isLoading,
		error,
	} = useSnapfishContext();

	return (
		<Container
			as="form"
			maxWidth="container.sm"
			method="dialog"
			onSubmit={handleSubmit}
		>
			<Stack spacing={4}>
				<EmailField value={email} onChange={handleEmailChange} />
				<PasswordField value={password} onChange={handlePasswordChange} />

				<LoginButton isLoading={isLoading} />

				{error && (
					<Alert status="error">
						<AlertIcon />
						<AlertDescription>
							<Code colorScheme="red">{error}</Code>
						</AlertDescription>
					</Alert>
				)}
			</Stack>
		</Container>
	);
};
