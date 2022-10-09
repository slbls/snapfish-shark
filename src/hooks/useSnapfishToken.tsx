import { getSnapfishToken } from "@/utils/getSnapfishToken";
import { useCallback, useEffect, useState } from "react";

type UseSnapfishTokenParams = {
	readonly email: string;
	readonly password: string;
	readonly shouldGet?: boolean;
};

export const useSnapfishToken = ({
	email,
	password,
	shouldGet = false,
}: UseSnapfishTokenParams) => {
	const [token, setToken] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const callGetSnapfishToken = useCallback(async () => {
		setIsLoading(true);

		try {
			setToken(await getSnapfishToken({ email, password }));
		} catch (error: unknown) {
			setToken("");
			setError(error.toString());
		} finally {
			setIsLoading(false);
		}
	}, [email, password]);

	useEffect(() => {
		const shouldCallGetSnapfishToken = shouldGet && email && password && !token;
		console.log(shouldGet && email && password && !token);
		if (!shouldCallGetSnapfishToken) {
			return;
		}

		callGetSnapfishToken();
	}, [shouldGet, email, password, token, callGetSnapfishToken]);

	return { token, isLoading, error };
};
