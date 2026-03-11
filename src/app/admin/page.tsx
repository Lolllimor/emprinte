'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

interface InsightForm {
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
}

interface SiteSettings {
  navigationLinks: { label: string; href: string }[];
  footerNavigation: { label: string; href: string }[];
  socialMediaLinks: { platform: string; href: string }[];
  contactInfo: {
    email: string;
    phone: { label: string; number: string }[];
  };
  stats?: { value: string; label: string }[];
}

interface BuildAReader {
  booksCollected: number;
  totalBooks: number;
  pricePerBook: number;
}

interface Testimonial {
  id: string;
  text: string;
  name: string;
  title: string;
  rating?: number;
}

const defaultInsight: InsightForm = {
  title: '',
  description: '',
  date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  image: '',
  href: '',
};

export default function AdminPage() {
  const [insightForm, setInsightForm] = useState<InsightForm>(defaultInsight);
  const [insightStatus, setInsightStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsStatus, setSettingsStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const [buildAReader, setBuildAReader] = useState<BuildAReader | null>(null);
  const [buildAReaderStatus, setBuildAReaderStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsStatus, setTestimonialsStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  useEffect(() => {
    fetch(getApiUrl('settings'))
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    fetch(getApiUrl('build-a-reader'))
      .then((r) => r.json())
      .then(setBuildAReader)
      .catch(() => setBuildAReader(null));
  }, []);

  useEffect(() => {
    fetch(getApiUrl('testimonials'))
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const handleInsightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInsightStatus({ type: 'loading' });

    try {
      const res = await fetch(getApiUrl('insights'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: insightForm.title,
          description: insightForm.description,
          date: insightForm.date,
          image: insightForm.image,
          href: insightForm.href || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.details ? JSON.stringify(data.details) : data?.error ?? 'Failed to create post';
        setInsightStatus({ type: 'error', message: msg });
        return;
      }

      setInsightStatus({ type: 'success', message: 'Blog post created.' });
      setInsightForm({ ...defaultInsight, date: insightForm.date });
    } catch {
      setInsightStatus({ type: 'error', message: 'Request failed.' });
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSettingsStatus({ type: 'loading' });

    try {
      const res = await fetch(getApiUrl('settings'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.details ? JSON.stringify(data.details) : data?.error ?? 'Failed to update settings';
        setSettingsStatus({ type: 'error', message: msg });
        return;
      }

      setSettingsStatus({ type: 'success', message: 'Site info updated.' });
    } catch {
      setSettingsStatus({ type: 'error', message: 'Request failed.' });
    }
  };

  const updateNavLink = (
    arr: 'navigationLinks' | 'footerNavigation',
    idx: number,
    field: 'label' | 'href',
    value: string
  ) => {
    if (!settings) return;
    const copy = [...settings[arr]];
    copy[idx] = { ...copy[idx], [field]: value };
    setSettings({ ...settings, [arr]: copy });
  };

  const addNavLink = (arr: 'navigationLinks' | 'footerNavigation') => {
    if (!settings) return;
    setSettings({
      ...settings,
      [arr]: [...settings[arr], { label: '', href: '' }],
    });
  };

  const removeNavLink = (arr: 'navigationLinks' | 'footerNavigation', idx: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [arr]: settings[arr].filter((_, i) => i !== idx),
    });
  };

  const updateContact = (field: 'email' | string, value: string | { label: string; number: string }[]) => {
    if (!settings) return;
    if (field === 'email') {
      setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: value as string } });
    } else if (field === 'phone') {
      setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: value as { label: string; number: string }[] } });
    }
  };

  const updatePhone = (idx: number, field: 'label' | 'number', value: string) => {
    if (!settings) return;
    const copy = settings.contactInfo.phone.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    updateContact('phone', copy);
  };

  const addPhone = () => {
    if (!settings) return;
    updateContact('phone', [...settings.contactInfo.phone, { label: '', number: '' }]);
  };

  const removePhone = (idx: number) => {
    if (!settings) return;
    updateContact(
      'phone',
      settings.contactInfo.phone.filter((_, i) => i !== idx)
    );
  };

  const updateSocial = (idx: number, field: 'platform' | 'href', value: string) => {
    if (!settings) return;
    const copy = settings.socialMediaLinks.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setSettings({ ...settings, socialMediaLinks: copy });
  };

  const statsList = settings?.stats ?? [];
  const updateStat = (idx: number, field: 'value' | 'label', value: string) => {
    if (!settings) return;
    const copy = [...(settings.stats ?? [])];
    if (!copy[idx]) copy[idx] = { value: '', label: '' };
    copy[idx] = { ...copy[idx], [field]: value };
    setSettings({ ...settings, stats: copy });
  };

  const addStat = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      stats: [...(settings.stats ?? []), { value: '', label: '' }],
    });
  };

  const removeStat = (idx: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      stats: (settings.stats ?? []).filter((_, i) => i !== idx),
    });
  };

  const handleBuildAReaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildAReader) return;

    setBuildAReaderStatus({ type: 'loading' });
    try {
      const res = await fetch(getApiUrl('build-a-reader'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildAReader),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.details ? JSON.stringify(data.details) : data?.error ?? 'Failed to update';
        setBuildAReaderStatus({ type: 'error', message: msg });
        return;
      }
      setBuildAReaderStatus({ type: 'success', message: 'Build a Reader updated.' });
    } catch {
      setBuildAReaderStatus({ type: 'error', message: 'Request failed.' });
    }
  };

  const updateBuildAReader = (field: keyof BuildAReader, value: number) => {
    if (!buildAReader) return;
    setBuildAReader({ ...buildAReader, [field]: value });
  };

  const handleTestimonialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTestimonialsStatus({ type: 'loading' });
    try {
      const res = await fetch(getApiUrl('testimonials'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonials),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.details ? JSON.stringify(data.details) : data?.error ?? 'Failed to update';
        setTestimonialsStatus({ type: 'error', message: msg });
        return;
      }
      setTestimonialsStatus({ type: 'success', message: 'Testimonials updated.' });
    } catch {
      setTestimonialsStatus({ type: 'error', message: 'Request failed.' });
    }
  };

  const updateTestimonial = (idx: number, field: keyof Testimonial, value: string | number) => {
    const copy = testimonials.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    setTestimonials(copy);
  };

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      { id: String(Date.now()), text: '', name: '', title: '', rating: 5 },
    ]);
  };

  const removeTestimonial = (idx: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  };

  return (
    <main className="min-h-screen bg-[#F0FFFD] text-[#142218]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-bold text-[#015B51] font-lora">
            Admin
          </h1>
          <Link
            href="/"
            className="text-[#015B51] underline hover:no-underline"
          >
            Back to site
          </Link>
        </div>

        {/* Blog post upload */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[#015B51] mb-6 font-lora">
            Upload blog post
          </h2>
          <form
            onSubmit={handleInsightSubmit}
            className="flex flex-col gap-4 p-6 bg-white rounded-xl border border-[#CAE594]/50"
          >
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                type="text"
                value={insightForm.title}
                onChange={(e) =>
                  setInsightForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#015B51]/30"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Description</span>
              <textarea
                value={insightForm.description}
                onChange={(e) =>
                  setInsightForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#015B51]/30"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <input
                type="text"
                value={insightForm.date}
                onChange={(e) =>
                  setInsightForm((f) => ({ ...f, date: e.target.value }))
                }
                placeholder="e.g. Friday, April 8, 2026"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#015B51]/30"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Image URL</span>
              <input
                type="url"
                value={insightForm.image}
                onChange={(e) =>
                  setInsightForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#015B51]/30"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Link (optional)
              </span>
              <input
                type="url"
                value={insightForm.href}
                onChange={(e) =>
                  setInsightForm((f) => ({ ...f, href: e.target.value }))
                }
                placeholder="https://... or /insights/1"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#015B51]/30"
              />
            </label>
            <button
              type="submit"
              disabled={insightStatus.type === 'loading'}
              className="mt-2 px-6 py-3 bg-[#015B51] text-white rounded-lg font-medium hover:bg-[#014238] disabled:opacity-60"
            >
              {insightStatus.type === 'loading' ? 'Uploading…' : 'Upload post'}
            </button>
            {insightStatus.type === 'success' && (
              <p className="text-green-700 text-sm">{insightStatus.message}</p>
            )}
            {insightStatus.type === 'error' && (
              <p className="text-red-700 text-sm">{insightStatus.message}</p>
            )}
          </form>
        </section>

        {/* Build a Reader */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[#015B51] mb-6 font-lora">
            Edit Build a Reader
          </h2>

          {!buildAReader ? (
            <p className="text-gray-600">Loading…</p>
          ) : (
            <form
              onSubmit={handleBuildAReaderSubmit}
              className="flex flex-col gap-4 p-6 bg-white rounded-xl border border-[#CAE594]/50"
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Books collected</span>
                <input
                  type="number"
                  min={0}
                  value={buildAReader.booksCollected}
                  onChange={(e) =>
                    updateBuildAReader('booksCollected', parseInt(e.target.value, 10) || 0)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Total books (goal)</span>
                <input
                  type="number"
                  min={1}
                  value={buildAReader.totalBooks}
                  onChange={(e) =>
                    updateBuildAReader('totalBooks', parseInt(e.target.value, 10) || 1)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Price per book (NGN)</span>
                <input
                  type="number"
                  min={0}
                  value={buildAReader.pricePerBook}
                  onChange={(e) =>
                    updateBuildAReader('pricePerBook', parseInt(e.target.value, 10) || 0)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={buildAReaderStatus.type === 'loading'}
                className="mt-2 px-6 py-3 bg-[#015B51] text-white rounded-lg font-medium hover:bg-[#014238] disabled:opacity-60"
              >
                {buildAReaderStatus.type === 'loading' ? 'Saving…' : 'Save Build a Reader'}
              </button>
              {buildAReaderStatus.type === 'success' && (
                <p className="text-green-700 text-sm">{buildAReaderStatus.message}</p>
              )}
              {buildAReaderStatus.type === 'error' && (
                <p className="text-red-700 text-sm">{buildAReaderStatus.message}</p>
              )}
            </form>
          )}
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[#015B51] mb-6 font-lora">
            Edit testimonials
          </h2>
          <form
            onSubmit={handleTestimonialsSubmit}
            className="flex flex-col gap-6 p-6 bg-white rounded-xl border border-[#CAE594]/50"
          >
            {testimonials.map((t, idx) => (
              <div key={t.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(idx)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <textarea
                    value={t.text}
                    onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
                    placeholder="Quote"
                    rows={2}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                    placeholder="Name"
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={t.title}
                    onChange={(e) => updateTestimonial(idx, 'title', e.target.value)}
                    placeholder="Title (e.g. PROJECT MANAGER)"
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <label className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating (1–5)</span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={t.rating ?? 5}
                      onChange={(e) =>
                        updateTestimonial(idx, 'rating', parseInt(e.target.value, 10) || 5)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-16"
                    />
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestimonial}
              className="text-sm text-[#015B51] underline self-start"
            >
              Add testimonial
            </button>
            <button
              type="submit"
              disabled={testimonialsStatus.type === 'loading'}
              className="px-6 py-3 bg-[#015B51] text-white rounded-lg font-medium hover:bg-[#014238] disabled:opacity-60"
            >
              {testimonialsStatus.type === 'loading' ? 'Saving…' : 'Save testimonials'}
            </button>
            {testimonialsStatus.type === 'success' && (
              <p className="text-green-700 text-sm">{testimonialsStatus.message}</p>
            )}
            {testimonialsStatus.type === 'error' && (
              <p className="text-red-700 text-sm">{testimonialsStatus.message}</p>
            )}
          </form>
        </section>

        {/* Site info */}
        <section>
          <h2 className="text-xl font-semibold text-[#015B51] mb-6 font-lora">
            Update site info
          </h2>

          {!settings ? (
            <p className="text-gray-600">Loading settings…</p>
          ) : (
            <form
              onSubmit={handleSettingsSubmit}
              className="flex flex-col gap-8 p-6 bg-white rounded-xl border border-[#CAE594]/50"
            >
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Main navigation
                </h3>
                {settings.navigationLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        updateNavLink('navigationLinks', idx, 'label', e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Href (#about)"
                      value={link.href}
                      onChange={(e) =>
                        updateNavLink('navigationLinks', idx, 'href', e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeNavLink('navigationLinks', idx)}
                      className="px-2 text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNavLink('navigationLinks')}
                  className="text-sm text-[#015B51] underline"
                >
                  Add link
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Footer navigation
                </h3>
                {settings.footerNavigation.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        updateNavLink('footerNavigation', idx, 'label', e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Href"
                      value={link.href}
                      onChange={(e) =>
                        updateNavLink('footerNavigation', idx, 'href', e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeNavLink('footerNavigation', idx)}
                      className="px-2 text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNavLink('footerNavigation')}
                  className="text-sm text-[#015B51] underline"
                >
                  Add link
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Contact email
                </h3>
                <input
                  type="email"
                  value={settings.contactInfo.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Phone numbers
                </h3>
                {settings.contactInfo.phone.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Label (e.g. Adepeju)"
                      value={p.label}
                      onChange={(e) => updatePhone(idx, 'label', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={p.number}
                      onChange={(e) => updatePhone(idx, 'number', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removePhone(idx)}
                      className="px-2 text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhone}
                  className="text-sm text-[#015B51] underline"
                >
                  Add phone
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Social media
                </h3>
                {settings.socialMediaLinks.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2"
                  >
                    <select
                      value={s.platform}
                      onChange={(e) =>
                        updateSocial(idx, 'platform', e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                    </select>
                    <input
                      type="url"
                      placeholder="URL"
                      value={s.href}
                      onChange={(e) =>
                        updateSocial(idx, 'href', e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Stats (e.g. 50+, Active Members)
                </h3>
                {statsList.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Value (e.g. 50+)"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="px-2 text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStat}
                  className="text-sm text-[#015B51] underline"
                >
                  Add stat
                </button>
              </div>

              <button
                type="submit"
                disabled={settingsStatus.type === 'loading'}
                className="mt-2 px-6 py-3 bg-[#015B51] text-white rounded-lg font-medium hover:bg-[#014238] disabled:opacity-60"
              >
                {settingsStatus.type === 'loading'
                  ? 'Saving…'
                  : 'Save site info'}
              </button>
              {settingsStatus.type === 'success' && (
                <p className="text-green-700 text-sm">
                  {settingsStatus.message}
                </p>
              )}
              {settingsStatus.type === 'error' && (
                <p className="text-red-700 text-sm">
                  {settingsStatus.message}
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
