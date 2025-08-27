export const ParagraphMarkdown = ({
  children
}: {
  children?: React.ReactNode | undefined;
}) => {
  return <p className="mb-4 text-base">{children}</p>;
};
