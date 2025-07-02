import { Element } from "react-shiki";
import { ReactNode } from "react";

type HeadingProps = {
  className?: string | undefined;
  children?: ReactNode | undefined;
};

export const HeadingH1 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h1 className="mb-8 text-4xl font-extrabold">{stringValue}</h1>;
};

export const HeadingH2 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h2 className="mb-6 text-3xl font-bold">{stringValue}</h2>;
};

export const HeadingH3 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h3 className="mb-4 text-2xl font-bold">{stringValue}</h3>;
};

export const HeadingH4 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h4 className="mb-2 text-xl font-bold">{stringValue}</h4>;
};

export const HeadingH5 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h5 className="mb-2 text-lg font-bold">{stringValue}</h5>;
};

export const HeadingH6 = ({ children }: HeadingProps) => {
  const stringValue = String(children).trim();
  return <h6 className="mb-2 text-base font-bold">{stringValue}</h6>;
};
