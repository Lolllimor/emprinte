import type { Metadata } from 'next';

import { WorkshopRegistrationWizard } from '@/components/workshop/WorkshopRegistrationWizard';

export const metadata: Metadata = {
  title: 'Workshop Registration | Emprinte Readers Hub',
  description:
    'Register for Practical Steps to Financial Independence — an exclusive Emprinte workshop.',
};

export default function WorkshopRegisterPage() {
  return (
    <main className="min-h-screen bg-[#FCE8DF] px-4 py-8 sm:px-6 sm:py-12">
      <WorkshopRegistrationWizard />
    </main>
  );
}
