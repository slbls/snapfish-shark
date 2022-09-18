import { APP_DESCRIPTION, APP_NAME, HTML_TITLE_SEPARATOR } from "@/config";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { expect, it, vi } from "vitest";
import { DefaultHead, DefaultHeadProps } from "./DefaultHead";

vi.mock("next/head", () => ({
	__esModule: true,
	default: ({ children }: { readonly children: ReactNode }) => (
		<>{createPortal(children, document.head)}</>
	),
}));

vi.mock("@/config", () => ({
	APP_NAME: "foo",
	APP_DESCRIPTION: "bar",
	HTML_TITLE_SEPARATOR: " | ",
}));

const renderDefaultHead = (props?: DefaultHeadProps) =>
	render(<DefaultHead {...props} />, { container: document.head });

const additionalChild = <meta name="keywords" content="test" />;

const expectAdditionalChild = async (comparisonChild: Element) => {
	expect(comparisonChild).toBeInTheDocument();
	await expect(comparisonChild).toHaveAttribute("name", "keywords");
	await expect(comparisonChild).toHaveAttribute("content", "test");
};

it('renders children before component content when `childrenPosition` is "before"', async () => {
	renderDefaultHead({ childrenPosition: "before", children: additionalChild });

	const firstChild = document.head.children[0];
	expectAdditionalChild(firstChild);
});

it('renders children after component content when `childrenPosition` is "before"', async () => {
	renderDefaultHead({ childrenPosition: "after", children: additionalChild });

	const lastChild = document.head.children[document.head.children.length - 1];
	expectAdditionalChild(lastChild);
});

type ExpectDescriptionMetaParams = {
	readonly container: HTMLHeadElement;
	readonly description: string;
};

const expectDescriptionMeta = async ({
	container,
	description,
}: ExpectDescriptionMetaParams) => {
	const meta = container.querySelector('[name="description"]');
	expect(meta).toBeInTheDocument();
	await expect(meta).toHaveAttribute("content", description);
};

it("defaults description meta content to `APP_DESCRIPTION` when `description` prop is undefined", async () => {
	const { container } = renderDefaultHead();

	await expectDescriptionMeta({ container, description: APP_DESCRIPTION });
});

it("sets description meta content to `description` prop when prop is defined", async () => {
	const description = "bar";

	const { container } = renderDefaultHead({ description });

	await expectDescriptionMeta({ container, description });
});

it("defaults title to `APP_NAME` when `page` prop is undefined", () => {
	const { container } = renderDefaultHead();

	const title = container.querySelector("title");
	expect(title).toBeInTheDocument();
	expect(title).toHaveTextContent(APP_NAME);
});

it("sets title to `${page}${HTML_TITLE_SEPARATOR}${APP_NAME}` when `page` prop is defined", () => {
	const page = "Foo";

	const { container } = renderDefaultHead({ page });

	const title = container.querySelector("title");
	expect(title).toBeInTheDocument();
	expect(title).toHaveTextContent(`${page}${HTML_TITLE_SEPARATOR}${APP_NAME}`);
});
