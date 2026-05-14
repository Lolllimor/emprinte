// Badge component following Single Responsibility Principle
// Displays a small badge/pill-shaped label

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`bg-[#E63715] text-white h-6 px-4 flex justify-center items-center rounded-full w-fit text-[10px] md:text-[14px] font-poppins font-normal ${className}`}
    >
      {children}
    </span>
  );
}
