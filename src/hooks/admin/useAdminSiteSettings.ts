'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { toast } from 'sonner';

import { getDefaultSiteSettings, stats as homepageStats } from '@/constants/data';
import { getApiUrl, adminJsonHeaders } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import type {
  FormSubmitStatus,
  NavigationLink,
  SiteSettings,
  SocialMediaLink,
} from '@/types';

function mergeSiteSettingsFromApi(s: SiteSettings): SiteSettings {
  return {
    ...s,
    stats: homepageStats.map((def, i) => ({
      id: s.stats?.[i]?.id ?? String(i),
      label: def.label,
      value: (s.stats?.[i]?.value ?? def.value).trim() || def.value,
    })),
  };
}

export function useAdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() =>
    getDefaultSiteSettings(),
  );
  const [status, setStatus] = useState<FormSubmitStatus>({ type: 'idle' });

  useEffect(() => {
    fetch(getApiUrl('settings'))
      .then((r) => r.json())
      .then((raw: unknown) => {
        if (!raw || typeof raw !== 'object') return;
        const o = raw as Record<string, unknown>;
        const inner =
          o.data && typeof o.data === 'object'
            ? (o.data as SiteSettings)
            : (raw as SiteSettings);
        setSettings(mergeSiteSettingsFromApi(inner));
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setStatus({ type: 'loading' });
      try {
        const res = await fetch(getApiUrl('settings'), {
          method: 'PUT',
          credentials: 'include',
          headers: adminJsonHeaders(),
          body: JSON.stringify(settings),
        });
        const body = await res.json();
        if (!res.ok) {
          setStatus({
            type: 'error',
            message: getApiErrorMessage(body, 'Failed to update settings'),
          });
          return;
        }
        const o = body as Record<string, unknown>;
        if (o.data && typeof o.data === 'object') {
          setSettings(mergeSiteSettingsFromApi(o.data as SiteSettings));
        }
        toast.success('Site info updated.');
        setStatus({ type: 'success', message: 'Site info updated.' });
      } catch {
        setStatus({ type: 'error', message: 'Request failed.' });
      }
    },
    [settings],
  );

  const updateNavLink = useCallback(
    (
      arr: 'navigationLinks' | 'footerNavigation',
      idx: number,
      field: keyof NavigationLink,
      value: string,
    ) => {
      setSettings((s) => {
        if (!s) return s;
        const copy = [...s[arr]];
        copy[idx] = { ...copy[idx], [field]: value };
        return { ...s, [arr]: copy };
      });
    },
    [],
  );

  const addNavLink = useCallback(
    (arr: 'navigationLinks' | 'footerNavigation') => {
      setSettings((s) => {
        if (!s) return s;
        return {
          ...s,
          [arr]: [...s[arr], { label: '', href: '' }],
        };
      });
    },
    [],
  );

  const removeNavLink = useCallback(
    (arr: 'navigationLinks' | 'footerNavigation', idx: number) => {
      setSettings((s) => {
        if (!s) return s;
        return { ...s, [arr]: s[arr].filter((_, i) => i !== idx) };
      });
    },
    [],
  );

  const setContactEmail = useCallback((email: string) => {
    setSettings((s) =>
      s ? { ...s, contactInfo: { ...s.contactInfo, email } } : s,
    );
  }, []);

  const updatePhone = useCallback(
    (idx: number, field: 'label' | 'number', value: string) => {
      setSettings((s) => {
        if (!s) return s;
        const phone = s.contactInfo.phone.map((p, i) =>
          i === idx ? { ...p, [field]: value } : p,
        );
        return { ...s, contactInfo: { ...s.contactInfo, phone } };
      });
    },
    [],
  );

  const addPhone = useCallback(() => {
    setSettings((s) => {
      if (!s) return s;
      return {
        ...s,
        contactInfo: {
          ...s.contactInfo,
          phone: [...s.contactInfo.phone, { label: '', number: '' }],
        },
      };
    });
  }, []);

  const removePhone = useCallback((idx: number) => {
    setSettings((s) => {
      if (!s) return s;
      return {
        ...s,
        contactInfo: {
          ...s.contactInfo,
          phone: s.contactInfo.phone.filter((_, i) => i !== idx),
        },
      };
    });
  }, []);

  const updateSocial = useCallback(
    (idx: number, field: keyof SocialMediaLink, value: string) => {
      setSettings((s) => {
        if (!s) return s;
        const socialMediaLinks = s.socialMediaLinks.map((row, i) => {
          if (i !== idx) return row;
          if (field === 'platform') {
            return {
              ...row,
              platform: value as SocialMediaLink['platform'],
            };
          }
          return { ...row, href: value };
        });
        return { ...s, socialMediaLinks };
      });
    },
    [],
  );

  /** Homepage stats: fixed labels; only `value` (the headline number) is editable. */
  const updateStatValue = useCallback((idx: number, value: string) => {
    setSettings((s) => {
      const stats = homepageStats.map((def, i) => ({
        id: s.stats?.[i]?.id ?? String(i),
        label: def.label,
        value: i === idx ? value : (s.stats?.[i]?.value ?? def.value),
      }));
      return { ...s, stats };
    });
  }, []);

  const statsList = settings.stats ?? homepageStats;

  return {
    settings,
    status,
    submit,
    statsList,
    updateNavLink,
    addNavLink,
    removeNavLink,
    setContactEmail,
    updatePhone,
    addPhone,
    removePhone,
    updateSocial,
    updateStatValue,
  };
}
