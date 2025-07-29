type Props = { children: React.ReactNode; className?: string };

export default function InfoBadge({ children, className = '' }: Props) {
  return (
    <span className={`mb-3 text-xs font-semibold rounded bg-gray-100 text-gray-700 px-2 py-1 border border-gray-200 ${className}`}>
      {children}
    </span>
  );
} 