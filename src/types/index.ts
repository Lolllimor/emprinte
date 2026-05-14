export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface StatCardProps {
  /** Stable row id from settings API (`GET /api/settings`). */
  id?: string;
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

export interface Testimonial {
  id: string;
  text: string;
  name: string;
  title: string;
  rating?: number;
}

export interface InsightArticle {
  id: string;
  /** Public URL segment: `/blog/{slug}`. Falls back to `id` when absent. */
  slug?: string;
  date: string;
  title: string;
  description: string;
  image: string;
  /** Full article text or HTML shown on `/blog/[slug]`. */
  body?: string;
  href?: string;
  /** Byline on the article page (optional). */
  authorName?: string;
  authorRole?: string;
}

export interface DesktopNavigationProps {
  links: NavigationLink[];
  className?: string;
  linkClassName?: string;
  onLinkClick?: (link: NavigationLink) => void;
}

export interface StatsProps {
  value: string;
  label: string;
}

export interface BookProgressProps {
  booksCollected: number;
  totalBooks: number;
  pricePerBook: number;
  /** Up to 5 https image URLs (e.g. Cloudinary). Empty = homepage uses built-in fallback image. */
  slideshowUrls: string[];
}

/** Payload for creating an insight from the admin form (no server id yet). */
export interface InsightFormInput {
  title: string;
  description: string;
  body: string;
  date: string;
  image: string;
  href: string;
  authorName: string;
  authorRole: string;
  /** URL segment (optional); generated from title when empty on publish. */
  slug: string;
}

/** Site config editable from admin; reuses public content shapes. */
export interface SiteSettings {
  navigationLinks: NavigationLink[];
  footerNavigation: NavigationLink[];
  socialMediaLinks: SocialMediaLink[];
  contactInfo: ContactInfo;
  stats?: StatCardProps[];
}

/** Async form feedback used across admin sections. */
export type FormSubmitStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; message?: string }
  | { type: 'error'; message?: string };

export type AdminManageTile =
  | 'buildAReader'
  | 'testimonials'
  | 'settings';

/** Newsletter signup from `/api/emails` (admin list / export). */
export interface NewsletterSubscriber {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string | null;
}

export interface Snapshot {
  booksCollected: number | null;
  contactEmail: string | null;
  totalBooks: number | null;
  testimonialCount: number;
  insightCount: number;
  error: string | null;
  loading: boolean;
}

export interface AdminDashboardProps {
  refreshKey: number;
  onManage: (tile: AdminManageTile) => void;
}

export type DashboardTile =
  | {
      key: string;
      title: string;
      blurb: string;
      statLabel: string;
      highlight: string;
      detail: string | null;
      href: string;
    }
  | {
      key: string;
      title: string;
      blurb: string;
      statLabel: string;
      highlight: string;
      detail: string | null;
      manage: AdminManageTile;
    };