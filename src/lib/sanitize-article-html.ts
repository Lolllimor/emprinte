import sanitizeHtml from 'sanitize-html';

/** Safe HTML for public article body (from admin Tiptap). */
export function sanitizeArticleHtml(dirty: string): string {
  const s = dirty.trim();
  if (!s) return '';
  return sanitizeHtml(s, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'a',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'code',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

export function isProbablyRichHtml(text: string): boolean {
  const t = text.trim();
  if (t.length < 3) return false;
  return /<\/?[a-z][\s\S]*?>/i.test(t);
}
