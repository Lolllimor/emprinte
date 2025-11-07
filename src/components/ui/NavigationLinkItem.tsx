// NavigationLinkItem component following Single Responsibility Principle
// Handles only the rendering of a single navigation link

import type { NavigationLink } from '@/types';

interface NavigationLinkItemProps {
  link: NavigationLink;
  className?: string;
  onLinkClick?: () => void;
}

export function NavigationLinkItem({
  link,
  className = '',
  onLinkClick,
}: NavigationLinkItemProps) {
  return (
    <a
      href={link.href}
      onClick={onLinkClick}
      className={`text-gray-800 hover:text-green-800 transition-colors font-semibold font-campton ${className}`}
    >
      {link.label}
    </a>
  );
}
