import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * Converts markdown to HTML with minimal inline styling for Word compatibility
 */
export async function convertMarkdownToHtml(markdown: string): Promise<string> {
    // Convert markdown to HTML using remark
    const result = await remark()
        .use(remarkGfm) // Support GitHub Flavored Markdown
        .use(remarkHtml, { sanitize: false }) // Convert to HTML
        .process(markdown);

    let html = result.toString();

    // Apply minimal inline styles for Word compatibility
    // Word handles basic HTML tags well, so we keep styling minimal
    html = html
        // Headings - just adjust font sizes
        .replace(/<h1>/g, '<h1 style="font-size:2em;font-weight:bold;margin:0.67em 0;">')
        .replace(/<h2>/g, '<h2 style="font-size:1.5em;font-weight:bold;margin:0.75em 0;">')
        .replace(/<h3>/g, '<h3 style="font-size:1.17em;font-weight:bold;margin:0.83em 0;">')
        .replace(/<h4>/g, '<h4 style="font-size:1em;font-weight:bold;margin:1.12em 0;">')
        .replace(/<h5>/g, '<h5 style="font-size:0.83em;font-weight:bold;margin:1.5em 0;">')
        .replace(/<h6>/g, '<h6 style="font-size:0.67em;font-weight:bold;margin:1.67em 0;">')
        // Paragraphs
        .replace(/<p>/g, '<p style="margin:1em 0;">')
        // Code blocks
        .replace(/<pre>/g, '<pre style="background-color:#f5f5f5;padding:1em;border:1px solid #ddd;font-family:monospace;">')
        .replace(/<code>/g, '<code style="font-family:monospace;background-color:#f5f5f5;padding:0.2em 0.4em;">')
        // Remove code background when inside pre
        .replace(/<pre style="[^"]*"><code style="[^"]*">/g, '<\\0>')
        .replace(/<\\0>/g, '<pre style="background-color:#f5f5f5;padding:1em;border:1px solid #ddd;font-family:monospace;"><code style="font-family:monospace;">')
        // Blockquotes
        .replace(/<blockquote>/g, '<blockquote style="border-left:4px solid #ddd;padding-left:1em;margin-left:0;color:#666;">')
        // Lists
        .replace(/<ul>/g, '<ul style="margin:1em 0;padding-left:2em;">')
        .replace(/<ol>/g, '<ol style="margin:1em 0;padding-left:2em;">')
        // Tables
        .replace(/<table>/g, '<table style="border-collapse:collapse;width:100%;margin:1em 0;">')
        .replace(/<th>/g, '<th style="border:1px solid #ddd;padding:8px;background-color:#f5f5f5;font-weight:bold;">')
        .replace(/<td>/g, '<td style="border:1px solid #ddd;padding:8px;">')
        // Links
        .replace(/<a /g, '<a style="color:#0066cc;text-decoration:underline;" ')
        // Horizontal rules
        .replace(/<hr>/g, '<hr style="border:none;border-top:1px solid #ddd;margin:1em 0;">');

    // Return just the HTML fragment with meta charset for proper encoding
    return `<meta charset="utf-8">${html}`;
}
