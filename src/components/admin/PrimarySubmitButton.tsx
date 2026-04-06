import { adminPrimaryButton } from './admin-styles';

interface PrimarySubmitButtonProps {
  loading: boolean;
  idleLabel: string;
  loadingLabel: string;
  className?: string;
}

export function PrimarySubmitButton({
  loading,
  idleLabel,
  loadingLabel,
  className = 'mt-2',
}: PrimarySubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${className} ${adminPrimaryButton}`}
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}
