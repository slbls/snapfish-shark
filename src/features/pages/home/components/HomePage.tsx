import { DefaultHead } from "@/components/DefaultHead";
import { NextPage } from "next";

const name = "Home";

export const HomePage: NextPage = () => (
	<>
		<DefaultHead page={name} />
	</>
);
