import { useSnapfishToken } from "@/hooks/useSnapfishToken";
import { getMissingProviderError } from "@/utils/getMissingProviderErrorMessage";
import {
	ChangeEventHandler,
	createContext,
	FormEventHandler,
	ReactNode,
	useContext,
	useState,
} from "react";

type Snapfish = {
	readonly email: string;
	readonly handleEmailChange: ChangeEventHandler<HTMLInputElement>;
	readonly password: string;
	readonly handlePasswordChange: ChangeEventHandler<HTMLInputElement>;
	readonly handleSubmit: FormEventHandler<HTMLDivElement>;
	readonly token: string;
	readonly isLoading: boolean;
	readonly error: string;
};

const SnapfishContext = createContext<Snapfish | undefined>(undefined);

export const useSnapfishContext = () => {
	const context = useContext(SnapfishContext);

	if (context === undefined) {
		throw new Error(
			getMissingProviderError({
				hookName: "useSnapfishContext",
				providerName: "SnapfishProvider",
			})
		);
	}

	return context;
};

type SnapfishProviderProps = {
	readonly children: ReactNode;
};

export const SnapfishProvider = ({ children }: SnapfishProviderProps) => {
	const [email, setEmail] = useState("");
	const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (event) =>
		setEmail(event.target.value);

	const [password, setPassword] = useState("");
	const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) =>
		setPassword(event.target.value);

	const [hasSubmitted, setHasSubmitted] = useState(false);
	const handleSubmit: FormEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		setHasSubmitted(true);
	};

	const { token, isLoading, error } = useSnapfishToken({
		email,
		password,
		shouldGet: hasSubmitted,
	});

	return (
		<SnapfishContext.Provider
			value={{
				email,
				handleEmailChange,
				password,
				handlePasswordChange,
				handleSubmit,
				token,
				isLoading,
				error,
			}}
		>
			{children}
		</SnapfishContext.Provider>
	);
};
