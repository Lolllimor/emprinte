import type { HamburgerMenuProps } from '@/types';

export function HamburgerMenu({
  isOpen,
  onClick,
  className = '',
}: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 relative ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      type="button"
    >
      <span
        className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  );
}
