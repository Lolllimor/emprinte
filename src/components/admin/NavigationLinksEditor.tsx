import type { NavigationLink } from '@/types';

import { adminInputPlain, adminRemoveButton, adminTextButton } from './admin-styles';

interface NavigationLinksEditorProps {
  title: string;
  links: NavigationLink[];
  hrefPlaceholder?: string;
  onChange: (
    index: number,
    field: keyof NavigationLink,
    value: string
  ) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function NavigationLinksEditor({
  title,
  links,
  hrefPlaceholder = 'Href',
  onChange,
  onRemove,
  onAdd,
}: NavigationLinksEditorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
      {links.map((link, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Label"
            value={link.label}
            onChange={(e) => onChange(idx, 'label', e.target.value)}
            className={`flex-1 ${adminInputPlain}`}
          />
          <input
            type="text"
            placeholder={hrefPlaceholder}
            value={link.href}
            onChange={(e) => onChange(idx, 'href', e.target.value)}
            className={`flex-1 ${adminInputPlain}`}
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className={adminRemoveButton}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className={adminTextButton}>
        Add link
      </button>
    </div>
  );
}
