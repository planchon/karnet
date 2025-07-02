import { isValidElement, memo, ReactNode } from "react";
import ShikiHighlighter, {
  isInlineCode,
  useShikiHighlighter,
  type Element
} from "react-shiki";

type CodeMarkdownProps = {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
};

function extractCodeString(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children
      .map((child) => extractCodeString(child))
      .filter(Boolean)
      .join("\n");
  }

  if (
    isValidElement<{ children?: ReactNode }>(children) &&
    children.props.children
  ) {
    return extractCodeString(children.props.children);
  }

  return "";
}

export const CodeMarkdown = memo(
  ({ className, children, node, ...props }: CodeMarkdownProps) => {
    const code = extractCodeString(children);
    const isInline = node ? isInlineCode(node) : false;

    const highlightedCode = useShikiHighlighter(
      code,
      "javascript",
      "one-dark-pro",
      {
        delay: 150,
        showLineNumbers: true
      }
    );

    if (isInline) {
      return <InlineCodeMarkdown content={code} />;
    }

    return (
      <div className="shiki not-prose bg-chat-accent text-secondary-foreground relative text-sm font-[450] [&_pre]:overflow-auto [&_pre]:px-[1em] [&_pre]:py-[1em]">
        <span className="text-muted-foreground/85 absolute right-3 top-2 text-xs tracking-tighter">
          javascript
        </span>
        {highlightedCode}
      </div>
    );
  }
);

export const InlineCodeMarkdown = memo((props: { content: string }) => {
  const { content } = props;
  return <code className="font-mono">{content}</code>;
});
