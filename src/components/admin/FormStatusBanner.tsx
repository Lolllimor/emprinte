import type { FormSubmitStatus } from '@/types';

interface FormStatusBannerProps {
  status: FormSubmitStatus;
}

export function FormStatusBanner({ status }: FormStatusBannerProps) {
  if (status.type === 'error' && status.message) {
    return <p className="text-red-700 text-sm">{status.message}</p>;
  }
  return null;
}
