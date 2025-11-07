'use client';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';
import { MenuOverlay } from '@/components/ui/MenuOverlay';
import { MenuPanel } from '@/components/ui/MenuPanel';
import { DesktopNavigation } from '@/components/ui/DesktopNavigation';
import { useMenuState } from '@/hooks/useMenuState';
import { navigationLinks } from '@/constants/data';

export function Header() {
  const menuState = useMenuState();

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm py-4 px-8 xl:px-0   sticky top-0 z-50">
      <div className="flex items-center justify-between relative max-w-[1200px] mx-auto">
        <Logo />
        <DesktopNavigation links={navigationLinks} />
        <Button
          variant="primary"
          className="hidden lg:block font-semibold rounded-xl lg:px-[25px]"
          onClick={() => {
            window.open('mailto:hello@emprintereaders.com', '_blank');
          }}
        >
          Contact Us
        </Button>
        <HamburgerMenu isOpen={menuState.isOpen} onClick={menuState.toggle} />
        <MenuOverlay isOpen={menuState.isOpen} onClose={menuState.close} />
        <MenuPanel
          isOpen={menuState.isOpen}
          links={navigationLinks}
          onLinkClick={menuState.close}
        />
      </div>
    </header>
  );
}
