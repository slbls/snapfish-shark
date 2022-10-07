import { PageContainer } from "@/components/PageContainer";
import { AppProvider } from "@/providers/app";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
	<AppProvider>
		<PageContainer>
			<Component {...pageProps} />
		</PageContainer>
	</AppProvider>
);

export default App;
