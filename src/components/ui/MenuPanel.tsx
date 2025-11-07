import { Button } from './Button';
import { MenuCloseButton } from './MenuCloseButton';
import type { MenuPanelProps, NavigationLink } from '@/types';
import type { MouseEvent } from 'react';

export function MenuPanel({
  className = '',
  onLinkClick,
  onClose,
  onContactClick,
  isOpen,
  links,
}: MenuPanelProps) {
  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    link: NavigationLink
  ) => {
    event.preventDefault();
    onLinkClick?.(link);
    onClose();
  };

  const handleContactClick = () => {
    onContactClick?.();
    onClose();
  };

  return (
    <nav
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl h-dvh z-60 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${className}`}
      aria-label="Mobile navigation"
    >
      <MenuCloseButton onClose={onClose} />
      <div className="flex flex-col flex-1 pt-24 px-6 pb-6 bg-white">
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleLinkClick(event, link)}
              className="text-gray-800 hover:text-[#015B51] transition-colors font-medium text-lg py-3 border-b border-gray-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleContactClick}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
}
