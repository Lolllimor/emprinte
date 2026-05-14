'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const toolbarBtn =
  'rounded-md px-2.5 py-1.5 font-poppins text-xs font-semibold text-[#142218] transition hover:bg-[#005D51]/10 disabled:opacity-40';

type InsightArticleBodyEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

export function InsightArticleBodyEditor({
  value,
  onChange,
  disabled,
}: InsightArticleBodyEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-[#005D51] underline underline-offset-2',
        },
      }),
      Placeholder.configure({
        placeholder:
          'Tell your story. Use the toolbar for headings, lists, bold, and links.',
      }),
    ],
    content: value?.trim() ? value : '<p></p>',
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[min(420px,50vh)] max-w-none px-4 py-4 font-poppins text-sm leading-relaxed text-[#142218] focus:outline-none sm:px-5 sm:text-base sm:leading-[1.7] [&_blockquote]:border-l-2 [&_blockquote]:border-[#005D51]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div className="min-h-[min(420px,50vh)] animate-pulse rounded-xl border border-[#005D51]/12 bg-[#fafcfb]" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#005D51]/12 bg-white">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-[#005D51]/10 bg-[#fafcfb] px-2 py-2 sm:px-3"
        role="toolbar"
        aria-label="Formatting"
      >
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <span className="mx-1 h-5 w-px bg-[#005D51]/15" aria-hidden />
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
        >
          H2
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
        >
          H3
        </button>
        <span className="mx-1 h-5 w-px bg-[#005D51]/15" aria-hidden />
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          List
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          Numbered
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
        >
          Quote
        </button>
        <span className="mx-1 h-5 w-px bg-[#005D51]/15" aria-hidden />
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => {
            const prev = globalThis.prompt('Link URL (https://…)', 'https://');
            if (!prev?.trim()) return;
            let url = prev.trim();
            if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          disabled={disabled}
        >
          Link
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={disabled}
        >
          Unlink
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
