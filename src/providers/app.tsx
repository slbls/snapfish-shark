import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SnapfishProvider } from "./snapfish";

type AppProviderProps = {
	readonly children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => (
	<ChakraProvider>
		<SnapfishProvider>{children}</SnapfishProvider>
	</ChakraProvider>
);
