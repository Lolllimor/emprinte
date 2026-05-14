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
      'bg-[#005D51] text-white hover:bg-[#004438] text-base lg:text-xl leading-[150%] font-poppins',
    secondary:
      'bg-white text-[#005D51] hover:bg-gray-50 text-xl leading-[150%] font-poppins',
    outline:
      'bg-white text-[#005D51] border-2 border-[#005D51] hover:bg-gray-50 text-xl leading-[150%] font-poppins',
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
