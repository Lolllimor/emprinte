'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';
import { MenuOverlay } from '@/components/ui/MenuOverlay';
import { MenuPanel } from '@/components/ui/MenuPanel';
import { DesktopNavigation } from '@/components/ui/DesktopNavigation';
import { useMenuState } from '@/hooks/useMenuState';
import { navigationLinks } from '@/constants/data';
import type { NavigationLink } from '@/types';
import Image from 'next/image';

export function Header() {
  const menuState = useMenuState();
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth >= 1024;
  });

  const handleNavigation = useCallback((link: NavigationLink) => {
    if (typeof window === 'undefined') {
      return;
    }

    const { href } = link;

    if (href === '/' || href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
      return;
    }

    if (href.startsWith('#')) {
      const target = document.querySelector(href);

      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
        return;
      }

      window.location.hash = href.slice(1);
      return;
    }

    window.location.href = href;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        menuState.close();
      }
    };

    setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [menuState]);


  return (
    <header className="w-full bg-white/90 backdrop-blur-sm py-4 px-8 xl:px-0   sticky top-0 z-50">
      <div className="flex items-center justify-between  max-w-[1200px] mx-auto">
        <Image
          src="/Logo.png"
          alt="Emprinte Readers Hub"
          width={139}
          height={58}
        />
        <DesktopNavigation
          links={navigationLinks}
          onLinkClick={handleNavigation}
        />
        <Button
          variant="primary"
          className="hidden lg:block font-semibold rounded-xl lg:px-[25px]"
          onClick={() => {
            window.open('mailto:hello@emprintereaders.com', '_blank');
          }}
        >
          Contact Us
        </Button>
        {!isDesktop && (
          <>
            <HamburgerMenu
              isOpen={menuState.isOpen}
              onClick={menuState.toggle}
            />
            <div className={`${menuState.isOpen ? 'block' : 'hidden'}`}>
              <MenuOverlay
                isOpen={menuState.isOpen}
                onClose={menuState.close}
              />
              <MenuPanel
                isOpen={menuState.isOpen}
                links={navigationLinks}
                onClose={menuState.close}
                onLinkClick={handleNavigation}
                onContactClick={() => {
                  window.open('mailto:hello@emprintereaders.com', '_blank');
                }}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
