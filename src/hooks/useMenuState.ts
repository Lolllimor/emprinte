// Custom hook following Dependency Inversion Principle
// Abstracts menu state management logic
// Allows Header to depend on abstraction rather than concrete implementation

import { useState, useCallback } from 'react';
import type { MenuState } from '@/types';

export function useMenuState(): MenuState {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    toggle,
    close,
    open,
  };
}
