// Badge component following Single Responsibility Principle
// Displays a small badge/pill-shaped label

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-medium inline-block ${className}`}
    >
      {children}
    </span>
  );
}
