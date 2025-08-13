import type { ReactNode } from "react";
import { Element } from "react-shiki";

type HeadingProps = {
	className?: string | undefined;
	children?: ReactNode | undefined;
};

export const HeadingH1 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h1 className="mb-8 text-3xl font-bold">{stringValue}</h1>;
};

export const HeadingH2 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h2 className="mb-6 text-2xl font-semibold">{stringValue}</h2>;
};

export const HeadingH3 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h3 className="mb-4 text-xl font-bold">{stringValue}</h3>;
};

export const HeadingH4 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h4 className="mb-2 text-lg font-semibold">{stringValue}</h4>;
};

export const HeadingH5 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h5 className="mb-2 text-base font-bold">{stringValue}</h5>;
};

export const HeadingH6 = ({ children }: HeadingProps) => {
	const stringValue = String(children).trim();
	return <h6 className="mb-2 text-base font-semibold">{stringValue}</h6>;
};
