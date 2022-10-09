import { Button } from "@chakra-ui/react";

type LoginButtonProps = {
	readonly isLoading?: boolean;
};

export const LoginButton = ({ isLoading = false }: LoginButtonProps) => (
	<Button
		type="submit"
		isLoading={isLoading}
		loadingText={isLoading ? "Logging in..." : undefined}
	>
		Log In
	</Button>
);
