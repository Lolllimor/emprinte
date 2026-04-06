'use client';

import { AdminSection } from './AdminSection';
import { FormStatusBanner } from './FormStatusBanner';
import { PrimarySubmitButton } from './PrimarySubmitButton';
import {
  adminInputPlain,
  adminRemoveButton,
  adminSiteSettingsForm,
  adminTextButton,
} from './admin-styles';
import { useAdminSiteSettings } from '@/hooks/admin/useAdminSiteSettings';
import { stats as homepageStatRows } from '@/constants/data';

interface AdminSiteSettingsSectionProps {
  embedded?: boolean;
}

export function AdminSiteSettingsSection({ embedded }: AdminSiteSettingsSectionProps) {
  const {
    settings,
    status,
    submit,
    statsList,
    setContactEmail,
    updatePhone,
    addPhone,
    removePhone,
    updateSocial,
    updateStatValue,
  } = useAdminSiteSettings();

  const inner = (
        <form onSubmit={submit} className={adminSiteSettingsForm}>
          {/* <NavigationLinksEditor
            title="Main navigation"
            links={settings.navigationLinks}
            hrefPlaceholder="Href (#about)"
            onChange={(idx, field, value) =>
              updateNavLink('navigationLinks', idx, field, value)
            }
            onRemove={(idx) => removeNavLink('navigationLinks', idx)}
            onAdd={() => addNavLink('navigationLinks')}
          /> */}

          {/* <NavigationLinksEditor
            title="Footer navigation"
            links={settings.footerNavigation}
            hrefPlaceholder="Href"
            onChange={(idx, field, value) =>
              updateNavLink('footerNavigation', idx, field, value)
            }
            onRemove={(idx) => removeNavLink('footerNavigation', idx)}
            onAdd={() => addNavLink('footerNavigation')}
          /> */}

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Contact email
            </h3>
            <input
              type="email"
              value={settings.contactInfo.email}
              onChange={(e) => setContactEmail(e.target.value)}
              className={`w-full ${adminInputPlain}`}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Phone numbers
            </h3>
            {settings.contactInfo.phone.map((p, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Adepeju)"
                  value={p.label}
                  onChange={(e) => updatePhone(idx, 'label', e.target.value)}
                  className={`flex-1 ${adminInputPlain}`}
                />
                <input
                  type="text"
                  placeholder="Number"
                  value={p.number}
                  onChange={(e) => updatePhone(idx, 'number', e.target.value)}
                  className={`flex-1 ${adminInputPlain}`}
                />
                <button
                  type="button"
                  onClick={() => removePhone(idx)}
                  className={adminRemoveButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addPhone} className={adminTextButton}>
              Add phone
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Social media
            </h3>
            {settings.socialMediaLinks.map((s, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={s.platform}
                  onChange={(e) =>
                    updateSocial(idx, 'platform', e.target.value)
                  }
                  className={adminInputPlain}
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>
                <input
                  type="url"
                  placeholder="URL"
                  value={s.href}
                  onChange={(e) => updateSocial(idx, 'href', e.target.value)}
                  className={`flex-1 ${adminInputPlain}`}
                />
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Homepage headline numbers
            </h3>
            <p className="mb-3 text-sm text-gray-600">
              These three lines always appear on the site; only the figure (e.g. 50+)
              is editable.
            </p>
            {homepageStatRows.map((row, idx) => {
              const stat = statsList[idx];
              return (
                <div
                  key={row.label}
                  className="mb-3 flex flex-col gap-2 sm:mb-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="shrink-0 text-sm font-medium text-gray-800 sm:w-[200px]">
                    {row.label}
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 50+"
                    value={stat?.value ?? row.value}
                    onChange={(e) => updateStatValue(idx, e.target.value)}
                    className={`min-w-0 flex-1 ${adminInputPlain}`}
                    aria-label={`${row.label} figure`}
                  />
                </div>
              );
            })}
          </div>

          <PrimarySubmitButton
            loading={status.type === 'loading'}
            idleLabel="Save site info"
            loadingLabel="Saving…"
            className="mt-2"
          />
          <FormStatusBanner status={status} />
        </form>
  );

  if (embedded) return inner;

  return (
    <AdminSection title="Update site info" className="">
      {inner}
    </AdminSection>
  );
}
