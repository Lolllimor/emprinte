// Centralized data following Single Responsibility Principle
// All static data in one place for easy maintenance

import type {
  NavigationLink,
  SocialMediaLink,
  ContactInfo,
  BootcampCardProps,
  InsightArticle,
  Testimonial,
} from '@/types';

export const navigationLinks: NavigationLink[] = [
  { label: 'About Us', href: '#about' },
  { label: 'Initiatives', href: '#initiatives' },
  { label: 'Bootcamps', href: '#bootcamps' },
];

export const footerNavigation: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Bootcamps', href: '#bootcamps' },
  { label: 'Initiatives', href: '#initiatives' },
  { label: 'About Us', href: '#about' },
];

export const socialMediaLinks: SocialMediaLink[] = [
  { platform: 'instagram', href: 'https://instagram.com/emprinte' },
  { platform: 'linkedin', href: 'https://linkedin.com/company/emprinte' },
  { platform: 'twitter', href: 'https://twitter.com/emprinte' },
];

export const contactInfo: ContactInfo = {
  email: 'hello@emprintereaders.com',
  phone: [
    { label: 'Adepeju', number: '081029348475' },
    { label: 'Abiola', number: '081029348475' },
  ],
};

export const stats = [
  { value: '50+', label: 'Active Members' },
  { value: '156+', label: 'Book Reviews' },
  { value: '2000+', label: 'Beautiful Stories' },
];

export const bookClubHero = {
  badge: 'Book Club',
  title: 'Reading That Changes the World.',
  description:
    "At Emprinte, we're on a mission to make Africa the world's most passionate reading community. From our engaging projects to our vibrant online space, we're helping readers grow, connect, and thrive. Ready to turn the page?",
  buttonText: 'Join Now',
};

export const insightArticles: InsightArticle[] = [
  {
    id: '1',
    date: 'Friday, April 8, 2026',
    title: 'This Place Will Contain The Title Of The Article.',
    description:
      'This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article.',
    image: 'https://picsum.photos/400/280?random=1',
  },
  {
    id: '2',
    date: 'Friday, April 8, 2026',
    title: 'This Place Will Contain The Title Of The Article.',
    description:
      'This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article.',
    image: 'https://picsum.photos/400/280?random=2',
  },
  {
    id: '3',
    date: 'Friday, April 8, 2026',
    title: 'This Place Will Contain The Title Of The Article.',
    description:
      'This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article. This Place Will Contain The Title Of The Article.',
    image: 'https://picsum.photos/400/280?random=3',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    text: 'The biggest change for me has been consistency. To put it simply, Emprinte is a community of growth and self-development.',
    name: 'ADEOLA AINA',
    title: 'PROJECT MANAGER',
    rating: 5,
  },
  {
    id: '2',
    text: 'For me, Emprinte feels like a family away from home. The community has grown to represent a place where I can connect with like-minded, growth-inclined individuals.',
    name: 'IFESOLA OWOYEMI',
    title: 'HR MANAGER',
    rating: 5,
  },
  {
    id: '3',
    text: 'Emprinte is my growth family. The community has helped me to be more disciplined, and has provided a space that constantly challenges me to be better.',
    name: 'AYOBAMI AKOMOLAFE',
    title: 'FASHION DESIGNER',
    rating: 5,
  },
 
];

export const bootcampCards: BootcampCardProps[] = [
  {
    title: 'FINANCIAL TRACKER BOOTCAMP',
    cohort: 'Cohort II',
    participants: '8 20+',
    backgroundColor: 'bg-pink-200',
  },
  {
    title: 'SHOW YOUR WORK BOOTCAMP',
    cohort: 'Cohort I',
    participants: '8 25+',
    backgroundColor: 'bg-green-200',
  },
  {
    title: '5AM CLUB BOOTCAMP',
    cohort: 'Cohort III',
    participants: '8 34+',
    backgroundColor: 'bg-yellow-200',
  },
  {
    title: 'PRODUCTIVITY BOOTCAMP',
    cohort: 'Cohort IV',
    participants: '8 23+',
    backgroundColor: 'bg-green-600',
  },
  {
    title: 'EMPRINTE READING ROOM',
    cohort: 'Cohort XII',
    participants: '8 20+',
    backgroundColor: 'bg-purple-200',
  },
];
