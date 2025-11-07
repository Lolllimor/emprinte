import { NavigationLinkItem } from './NavigationLinkItem';
import type { DesktopNavigationProps } from '@/types';

export function DesktopNavigation({
  linkClassName = '',
  className = '',
  onLinkClick,
  links,
}: DesktopNavigationProps) {
  return (
    <nav
      className={`items-center gap-8 absolute left-1/2 transform -translate-x-1/2 hidden lg:flex ${className}`}
      aria-label="Desktop navigation"
    >
      {links.map((link) => (
        <NavigationLinkItem
          onLinkClick={onLinkClick}
          className={linkClassName}
          key={link.href}
          link={link}
        />
      ))}
    </nav>
  );
}
