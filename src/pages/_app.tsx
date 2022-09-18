import { AppProvider } from "@/providers/app";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => (
	<AppProvider>
		<Component {...pageProps} />
	</AppProvider>
);

export default App;
