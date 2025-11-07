export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface StatCardProps {
  value: string;
  label: string;
}

export interface BootcampCardProps {
  title: string;
  cohort: string;
  participants: string;
  backgroundColor: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface SocialMediaLink {
  platform: 'instagram' | 'linkedin' | 'twitter';
  href: string;
}

export interface ContactInfo {
  email: string;
  phone: {
    label: string;
    number: string;
  }[];
}

export interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface MenuPanelProps {
  isOpen: boolean;
  links: NavigationLink[];
  onLinkClick?: (link: NavigationLink) => void;
  onClose: () => void;
  onContactClick?: () => void;
  className?: string;
}

export interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

export interface DesktopNavigationProps {
  links: NavigationLink[];
  className?: string;
  linkClassName?: string;
  onLinkClick?: (link: NavigationLink) => void;
}
