type Props = { categories: string[] };

export default function CategoryBadges({ categories }: Props) {
  return (
    <div className="flex flex-wrap gap-2 self-start mt-4">
      {categories.map((cat, idx) => (
        <span
          key={idx}
          className="text-xs px-3 py-1 font-semibold rounded-full shadow-sm bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-700 border border-gray-200 select-none"
        >
          {cat}
        </span>
      ))}
    </div>
  );
} 