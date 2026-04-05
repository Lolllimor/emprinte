'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';

import { useAdminInsights } from '@/hooks/admin/useAdminInsights';
import type { InsightArticle } from '@/types';
import { AdminModal } from '@/components/admin/AdminModal';
import { LabeledInput, LabeledTextarea } from './LabeledField';
import { PrimarySubmitButton } from './PrimarySubmitButton';
import { FormStatusBanner } from './FormStatusBanner';

/** Matches `BlogArticleList` grid card shell (public blog). */
const adminBlogCardShell =
  'flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(1,91,81,0.05),0_8px_28px_-16px_rgba(20,34,24,0.12)] ring-1 ring-[#015B51]/[0.06] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-20px_rgba(20,34,24,0.16)] hover:ring-[#015B51]/15';

function CardGridSkeleton() {
  return (
    <ul
      className="grid list-none grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-3 lg:gap-8"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <li key={i} className="min-h-[260px]">
          <div
            className={`${adminBlogCardShell} animate-pulse ring-0 hover:translate-y-0 hover:shadow-[0_8px_28px_-16px_rgba(20,34,24,0.12)]`}
          >
            <div className="aspect-5/3 w-full bg-[#dfecea]" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-3 w-20 rounded bg-[#015B51]/15" />
              <div className="h-5 w-full max-w-[90%] rounded bg-[#142218]/10" />
              <div className="h-3 w-full rounded bg-[#142218]/08" />
              <div className="h-3 w-full rounded bg-[#142218]/08" />
              <div className="mt-4 flex gap-2 border-t border-[#015B51]/08 pt-4">
                <div className="h-9 flex-1 rounded-lg bg-[#015B51]/12" />
                <div className="h-9 flex-1 rounded-lg bg-[#142218]/08" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AdminBlogPostCard({
  article,
  isEditing,
  onEdit,
  onDelete,
}: {
  article: InsightArticle;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className={`${adminBlogCardShell} ${
        isEditing
          ? 'ring-2 ring-[#015B51] ring-offset-2 ring-offset-[#f4faf8]'
          : ''
      }`}
    >
      <div className="relative aspect-5/3 w-full shrink-0 overflow-hidden bg-[#e4f2ef]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4 md:gap-2.5 md:p-5">
        <p className="font-campton text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#015B51]">
          <time dateTime={article.date}>{article.date}</time>
        </p>
        <h2 className="line-clamp-2 font-lora text-base font-bold leading-snug text-[#142218] md:text-lg">
          {article.title}
        </h2>
        <p className="line-clamp-3 font-campton text-xs leading-relaxed text-[#5a6570] md:text-sm">
          {article.description}
        </p>
        <p className="font-mono text-[10px] leading-tight text-[#8a9399]">
          id · {article.id}
        </p>

        <div className="mt-auto flex flex-col gap-3 border-t border-[#015B51]/08 pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-w-22 flex-1 items-center justify-center rounded-lg bg-[#015B51] px-3 py-2.5 font-campton text-xs font-semibold text-white transition hover:bg-[#014238] sm:flex-none sm:px-4"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex min-w-22 flex-1 items-center justify-center rounded-lg border border-red-200/90 bg-white px-3 py-2.5 font-campton text-xs font-semibold text-red-700 transition hover:bg-red-50 sm:flex-none sm:px-4"
            >
              Delete
            </button>
          </div>
          <Link
            href={`/blog/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#015B51]/20 bg-[#F0FFFD]/80 px-3 py-2 font-campton text-xs font-semibold text-[#015B51] transition hover:border-[#015B51]/35 hover:bg-[#015B51]/08"
          >
            View live post
            <span aria-hidden className="text-sm leading-none">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function AdminInsightsPanel() {
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const {
    listLoading,
    cancelEdit,
    editingId,
    startEdit,
    setField,
    status,
    remove,
    submit,
    list,
    form,
  } = useAdminInsights();

  const closeArticleModal = () => {
    setArticleModalOpen(false);
    cancelEdit();
  };

  const openNewArticleModal = () => {
    cancelEdit();
    setArticleModalOpen(true);
  };

  const openEditArticleModal = (row: InsightArticle) => {
    startEdit(row);
    setArticleModalOpen(true);
  };

  useEffect(() => {
    if (status.type !== 'success' || !articleModalOpen) return;
    const msg = status.message ?? '';
    if (msg === 'Article updated.' || msg === 'Article created.') {
      setArticleModalOpen(false);
    }
  }, [status, articleModalOpen]);

  const handleFormSubmit = (e: FormEvent) => {
    void submit(e);
  };

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="blog-posts-list-heading"
        className="overflow-hidden rounded-2xl border border-[#015B51]/12 bg-white shadow-[0_1px_2px_rgba(20,34,24,0.04)]"
      >
        <div className="flex flex-col gap-4 border-b border-[#015B51]/10 bg-[#F0FFFD]/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h2
              id="blog-posts-list-heading"
              className="font-lora text-lg font-semibold text-[#142218]"
            >
              All posts
            </h2>
            <p className="mt-1 font-campton text-sm font-medium text-[#7B7B7B]">
              Same card layout as the public blog. Use the button to add a post,
              or edit from a card.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewArticleModal}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#015B51] px-5 py-2.5 font-campton text-sm font-semibold text-white shadow-[0_1px_2px_rgba(20,34,24,0.08)] transition hover:bg-[#014238] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#015B51]/40 focus-visible:ring-offset-2"
          >
            New post
          </button>
        </div>

        <div className="bg-[#f4faf8]">
          {listLoading ? (
            <CardGridSkeleton />
          ) : list.length === 0 ? (
            <div className="px-5 py-12 text-center sm:px-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-[#015B51]/20 bg-[#F0FFFD] text-[#015B51]">
                <svg
                  className="h-7 w-7 opacity-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <p className="font-lora text-base font-semibold text-[#142218]">
                No posts yet
              </p>
              <p className="mx-auto mt-2 max-w-md font-campton text-sm font-medium leading-relaxed text-[#7B7B7B]">
                Click <span className="font-semibold text-[#142218]">New post</span>{' '}
                above to create your first article.
              </p>
            </div>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8">
              {list.map((row) => (
                <li key={row.id} className="min-h-0 sm:min-h-[260px]">
                  <AdminBlogPostCard
                    article={row}
                    isEditing={editingId === row.id && articleModalOpen}
                    onEdit={() => openEditArticleModal(row)}
                    onDelete={() => remove(row.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AdminModal
        open={articleModalOpen}
        onClose={closeArticleModal}
        title={editingId ? 'Edit article' : 'New article'}
        description={
          editingId
            ? 'Update the fields below and save. Changes appear on the live site right away.'
            : 'Add title, excerpt, optional full article, date, and image URL. Publish when you are ready.'
        }
        wide
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {editingId ? (
            <p className="rounded-xl border border-[#015B51]/15 bg-white/80 px-4 py-3 font-campton text-sm font-medium text-[#142218]">
              Editing an existing post.{' '}
              <button
                type="button"
                onClick={() => {
                  cancelEdit();
                  setArticleModalOpen(true);
                }}
                className="font-semibold text-[#015B51] underline decoration-[#015B51]/35 underline-offset-2 hover:text-[#014238]"
              >
                Switch to new post
              </button>
            </p>
          ) : null}
          <LabeledInput
            label="Title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            required
          />
          <LabeledTextarea
            label="Short excerpt"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            rows={3}
            required
          />
          <LabeledTextarea
            label="Full article (blog post page)"
            value={form.body}
            onChange={(e) => setField('body', e.target.value)}
            rows={10}
            placeholder="Use blank lines between paragraphs."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <LabeledInput
              label="Publication date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              required
            />
            <LabeledInput
              label="Image URL"
              type="url"
              value={form.image}
              onChange={(e) => setField('image', e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <LabeledInput
            label="External link (optional)"
            type="url"
            value={form.href}
            onChange={(e) => setField('href', e.target.value)}
            placeholder="https://… — if you leave the full article empty"
          />
          <div className="pt-2">
            <PrimarySubmitButton
              loading={status.type === 'loading'}
              idleLabel={editingId ? 'Save changes' : 'Publish article'}
              loadingLabel={editingId ? 'Saving…' : 'Publishing…'}
            />
          </div>
          <FormStatusBanner status={status} />
        </form>
      </AdminModal>
    </div>
  );
}
