import type { MouseEvent } from 'react';
import type { NavigationLink } from '@/types';

interface NavigationLinkItemProps {
  link: NavigationLink;
  className?: string;
  onLinkClick?: (link: NavigationLink) => void;
}

export function NavigationLinkItem({
  link,
  className = '',
  onLinkClick,
}: NavigationLinkItemProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onLinkClick) {
      return;
    }

    event.preventDefault();
    onLinkClick(link);
  };

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={`text-gray-800 hover:text-green-800 transition-colors font-semibold font-campton ${className}`}
    >
      {link.label}
    </a>
  );
}
