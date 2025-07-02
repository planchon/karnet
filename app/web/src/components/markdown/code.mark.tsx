import { Copy } from "lucide-react";
import { isValidElement, memo, ReactNode } from "react";
import { Button } from "@ui/button";
import ShikiHighlighter, {
  isInlineCode,
  useShikiHighlighter,
  type Element
} from "react-shiki";
import { IconDownload } from "@tabler/icons-react";

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
      "one-dark",
      {
        delay: 150
      }
    );

    if (isInline) {
      return <InlineCodeMarkdown content={code} />;
    }

    return (
      <div className="shiki not-prose bg-chat-accent rounded-4xl text-secondary-foreground relative py-2 text-sm font-[450] [&_pre]:overflow-auto [&_pre]:px-[1em] [&_pre]:py-[1em]">
        <div className="bg-accent-foreground flex h-full w-full items-center justify-between rounded-t-md p-1">
          <span className="text-muted pl-2 text-xs tracking-tighter">
            javascript
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <IconDownload className="text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="text-muted-foreground" />
            </Button>
          </div>
        </div>
        {highlightedCode}
      </div>
    );
  }
);

export const InlineCodeMarkdown = memo((props: { content: string }) => {
  const { content } = props;
  return <code className="font-mono">{content}</code>;
});
