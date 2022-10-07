import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

type PageContainerProps = {
	readonly children: ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => (
	<Container maxWidth="container.xl" paddingY={8}>
		{children}
	</Container>
);
