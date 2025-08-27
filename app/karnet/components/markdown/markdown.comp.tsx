import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeMarkdown } from './code.mark';
import {
  HeadingH1,
  HeadingH2,
  HeadingH3,
  HeadingH4,
  HeadingH5,
  HeadingH6,
} from './heading.mark';
import {
  ListItemMarkdown,
  OrderedListMarkdown,
  UnorderedListMarkdown,
} from './list.mark';
import { ParagraphMarkdown } from './paragraph.mark';
import { RulerMarkdown } from './ruler.mark';

function getMarkdownBlocks(content: string): string[] {
  const tokens = marked.lexer(content);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ block }: { block: string }) => {
    return (
      <ReactMarkdown
        components={{
          p: ParagraphMarkdown,
          hr: RulerMarkdown,
          h1: HeadingH1,
          h2: HeadingH2,
          h3: HeadingH3,
          h4: HeadingH4,
          h5: HeadingH5,
          h6: HeadingH6,
          code: CodeMarkdown,
          ul: UnorderedListMarkdown,
          ol: OrderedListMarkdown,
          li: ListItemMarkdown,
        }}
      >
        {block}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.block === nextProps.block;
  }
);

export const Markdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => getMarkdownBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock block={block} key={`${id}-block_${index}`} />
    ));
  }
);
