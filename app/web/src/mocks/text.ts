export default `Okay, here's a comprehensive Markdown text demonstrating almost all the common components and some popular extensions.

---

# Markdown Components Showcase

This document serves as a comprehensive demonstration of various Markdown components, from the basics to more advanced features.

---

## 1. Headings

Markdown supports six levels of headings.

# H1: Largest Heading
## H2: Second Largest
### H3: Third Largest
#### H4: Fourth Largest
##### H5: Fifth Largest
###### H6: Smallest Heading

You can also use an alternative syntax for H1 and H2:

Alternative H1
==============

Alternative H2
--------------

---

## 2. Paragraphs

Paragraphs are simply one or more consecutive lines of text separated by one or more blank lines.

This is a paragraph. It's a fundamental block of text in Markdown. When you write multiple lines, they automatically wrap to form a single paragraph until a blank line is encountered.

This is another paragraph. It's separated from the one above by a blank line.

---

## 3. Text Formatting

### Emphasis

*   *Italic* using asterisks
*   _Italic_ using underscores
*   **Bold** using double asterisks
*   __Bold__ using double underscores
*   ***Bold and Italic*** using triple asterisks
*   ___Bold and Italic___ using triple underscores

### Strikethrough (GFM)

*   ~~Strikethrough~~ text.

### Code

todo inline

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes are also possible.
> > > Very deep.

---

## 4. Lists

### Unordered Lists (Bullet Lists)

*   Item 1
    *   Nested Item 1.1
    *   Nested Item 1.2
        *   Even deeper
*   Item 2
    -   Using a hyphen
    +   Using a plus sign

### Ordered Lists (Numbered Lists)

1.  First item
2.  Second item
    1.  Nested ordered item
    2.  Another nested item
        1.  Even deeper
3.  Third item

You can also use different numbers, Markdown will still render them correctly:
1.  Apple
8.  Banana
3.  Cherry

## 6. Links

*   [Regular Link](https://www.example.com "Optional Title")
*   [Link with relative path](/path/to/page)
*   <https://www.autolink.com> (Autolink)
*   <mailto:example@example.com> (Autolink email)

### Reference-style Links

I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].

[1]: https://www.google.com/ "Google Homepage"
[2]: https://www.yahoo.com/ "Yahoo Homepage"
[3]: https://www.bing.com/ "MSN (now Bing) Homepage"

You can also use implicit names (matching the link text):
Visit [Example Website].

[Example Website]: https://www.example.com "Example Site"

---

## 7. Images

*   ![Alt text for the image](https://via.placeholder.com/150 "Optional Image Title")
*   ![Another image alt text](/path/to/image.jpg)

### Reference-style Images

![Reference Image Alt Text][image_ref_id]

[image_ref_id]: https://via.placeholder.com/200/FF0000/FFFFFF?text=Red+Box "Reference Image Title"

---

## 8. Horizontal Rules

Three or more hyphens, asterisks, or underscores can create a horizontal rule.

---

***

___

---

## 9. Tables (GFM)

| Header 1 | Header 2 | Header 3 |
| :------- | :------: | -------: |
| Left     | Center   | Right    |
| Cell 1   | Cell 2   | Cell 3   |
| Long text content | More content | Even more content that wraps |

---

## 10. Task Lists (GFM)

*   [x] Completed task
*   [ ] Incomplete task
    *   [x] Sub-task completed
    *   [ ] Sub-task incomplete
*   [ ] Another incomplete task

---

## 11. Front Matter (Common in static site generators like Jekyll, Hugo)

*(Note: Front matter itself is not rendered by the Markdown engine; it's parsed by the static site generator or application that consumes the Markdown file.)*

---

## 12. Footnotes (Often an extension)

Here's some text with a footnote reference.[^note1]

And here's another one.[^note2]

[^note1]: This is the first footnote.
[^note2]: This is the second footnote, which can be quite long and span multiple lines. It can also contain other Markdown elements like **bold text** or even 

---

## 13. Definition Lists (Often an extension)

Term 1
: Definition of Term 1.

Term 2
: Definition of Term 2.
: Another definition for Term 2.

---

## 14. Escaping Characters

If you need to use a Markdown special character literally, precede it with a backslash.

*   \* Not an italic \*
*   \`This is not code\`
*   \# Not a heading \#
*   \[Not a link\]\(url\)

---

## 15. HTML Raw Blocks (Allowed in some Markdown parsers)

Markdown is often seen as a superset of HTML, meaning you can embed raw HTML.

<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <p>This is a paragraph created directly with <strong>HTML</strong> inside a Markdown document.</p>
  <ul>
    <li>Item one</li>
    <li>Item two</li>
  </ul>
</div>

---

This document covers most of the widely used Markdown syntax elements. Remember that the exact rendering might vary slightly depending on the Markdown engine or platform you are using.
`;
