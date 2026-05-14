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
            'rounded-xl border border-[#005D51]/15 bg-white font-[family-name:var(--font-poppins)] text-[#142218] shadow-[0_8px_30px_rgba(0,93,81,0.12)]',
          success:
            'border-[#005D51]/30 !bg-[#F0FFFD] [&_[data-icon]]:!text-[#005D51]',
          title: 'text-[#142218] font-medium',
          description: 'text-[#4a5c50]',
        },
      }}
    />
  );
}
