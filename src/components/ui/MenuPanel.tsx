import { Button } from './Button';
import { MenuCloseButton } from './MenuCloseButton';
import type { MenuPanelProps } from '@/types';

export function MenuPanel({
  className = '',
  onLinkClick,
  isOpen,
  links,
}: MenuPanelProps) {
  return (
    <nav
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${className}`}
      aria-label="Mobile navigation"
    >
      <MenuCloseButton onClose={onLinkClick} />
      <div className="flex flex-col h-full pt-24 px-6 pb-6">
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className="text-gray-800 hover:text-[#015B51] transition-colors font-medium text-lg py-3 border-b border-gray-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button variant="primary" className="w-full" onClick={onLinkClick}>
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
}
