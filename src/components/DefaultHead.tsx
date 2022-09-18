import { APP_DESCRIPTION, APP_NAME, HTML_TITLE_SEPARATOR } from "@/config";
import Head from "next/head";
import { ReactNode } from "react";

export type DefaultHeadProps = {
	readonly page?: string;
	readonly description?: string;
	readonly childrenPosition?: "before" | "after";
	readonly children?: ReactNode;
};

export const DefaultHead = ({
	page,
	description,
	childrenPosition = "before",
	children,
}: DefaultHeadProps) => {
	const areChildrenBefore = childrenPosition === "before";

	return (
		<Head>
			{areChildrenBefore && children}

			<meta name="description" content={description ?? APP_DESCRIPTION} />

			<title>
				{page ? `${page}${HTML_TITLE_SEPARATOR}${APP_NAME}` : APP_NAME}
			</title>

			{!areChildrenBefore && children}
		</Head>
	);
};
