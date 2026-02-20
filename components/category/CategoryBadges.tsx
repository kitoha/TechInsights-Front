type Props = { 
  categories: string[];
};

export default function CategoryBadges({ categories }: Props) {
  return (
    <div className="flex flex-wrap gap-2.5 self-start mt-5">
      {categories.map((cat, idx) => (
        <span
          key={idx}
          className="text-[11px] px-4 py-1.5 font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 select-none uppercase tracking-wide hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
        >
          {cat}
        </span>
      ))}
    </div>
  );
} 