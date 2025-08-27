export const UnorderedListMarkdown = ({
  children
}: {
  children?: React.ReactNode | undefined;
}) => {
  return <ul className="list-disc pl-5 text-base">{children}</ul>;
};

export const ListItemMarkdown = ({
  children
}: {
  children?: React.ReactNode | undefined;
}) => {
  return <li className="mb-2 text-base">{children}</li>;
};

export const OrderedListMarkdown = ({
  children
}: {
  children?: React.ReactNode | undefined;
}) => {
  return <ol className="list-decimal pl-5 text-base">{children}</ol>;
};
