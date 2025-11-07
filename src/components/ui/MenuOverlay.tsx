// MenuOverlay component following Single Responsibility Principle
// Handles only the backdrop overlay functionality

import type { MenuOverlayProps } from '@/types';

export function MenuOverlay({
  isOpen,
  onClose,
  className = '',
}: MenuOverlayProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className}`}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
