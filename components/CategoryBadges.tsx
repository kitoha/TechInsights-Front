type Props = { 
  categories: string[];
};

export default function CategoryBadges({ categories }: Props) {
  return (
    <div className="flex flex-wrap gap-2 self-start mt-4">
      {categories.map((cat, idx) => (
        <span
          key={idx}
          className="text-xs px-3 py-1 font-semibold rounded-full shadow-sm bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 select-none"
        >
          {cat}
        </span>
      ))}
    </div>
  );
} 