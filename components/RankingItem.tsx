import Image from "next/image";

interface RankingItemProps {
  logo: string;
  name: string;
  score: number;
  rank: number;
}

export function RankingItem({ logo, name, score, rank }: RankingItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-6 text-center font-bold text-lg text-blue-600 dark:text-blue-400">{rank + 1}</span>
      <Image src={logo} alt={name} width={28} height={28} className="rounded-full bg-white border border-gray-200 dark:border-gray-700" />
      <span className="flex-1 truncate font-medium text-gray-800 dark:text-gray-200">{name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{score.toLocaleString()}</span>
    </div>
  );
} 