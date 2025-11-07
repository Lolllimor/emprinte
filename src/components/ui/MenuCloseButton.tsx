interface MenuCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export function MenuCloseButton({
  onClose,
  className = '',
}: MenuCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className={`absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors ${className} cursor-pointer`}
      aria-label="Close menu"
      type="button"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
