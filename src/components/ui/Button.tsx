import type { ButtonProps } from '@/types';

export function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'lg:h-[56px] h-10 lg:px-10 px-5 flex justify-center items-center gap-2.5 rounded-lg font-medium transition-colors';

  const variantStyles = {
    primary:
      'bg-[#015B51] text-white hover:bg-[#014238] text-base lg:text-xl leading-[150%] font-campton',
    secondary:
      'bg-white text-[#015B51] hover:bg-gray-50 text-xl leading-[150%] font-campton',
    outline:
      'bg-white text-[#015B51] border-2 border-[#015B51] hover:bg-gray-50 text-xl leading-[150%] font-campton',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
