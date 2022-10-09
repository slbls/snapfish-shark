import { DefaultHead } from "@/components/DefaultHead";
import { LoginForm } from "@/features/login";
import { NextPage } from "next";

const name = "Home";

export const HomePage: NextPage = () => (
	<>
		<DefaultHead page={name} />

		<LoginForm />
	</>
);
