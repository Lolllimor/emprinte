'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      offset="1.25rem"
      toastOptions={{
        classNames: {
          toast:
            'rounded-xl border border-[#015B51]/15 bg-white font-[family-name:var(--font-open-sans)] text-[#142218] shadow-[0_8px_30px_rgba(1,91,81,0.12)]',
          success:
            'border-[#015B51]/30 !bg-[#F0FFFD] [&_[data-icon]]:!text-[#015B51]',
          title: 'text-[#142218] font-medium',
          description: 'text-[#4a5c50]',
        },
      }}
    />
  );
}
